pipeline {
  agent any

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  environment {
    APP_NAME = 'meal-mate'
    IMAGE_REPO = 'meal-mate'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    IMAGE_URI = "${env.IMAGE_REPO}:${env.IMAGE_TAG}"
    PROD_IMAGE_TAG = 'prod'
    PROD_PORT = '8081'
    STAGING_PORT = '18080'
    REPORT_DIR = 'reports'
  }

  stages {

    stage('Build') {
      steps {
        sh 'mkdir -p $REPORT_DIR'
        sh 'npm ci'
        sh 'npm run build'
        sh 'tar -czf dist-${BUILD_NUMBER}.tar.gz dist'
        sh 'docker build -t $IMAGE_URI .'
      }
      post {
        success {
          archiveArtifacts artifacts: 'dist-*.tar.gz', fingerprint: true
        }
      }
    }

    stage('Test') {
      steps {
        sh 'mkdir -p $REPORT_DIR'
        sh 'npx vitest run --reporter=default --reporter=junit --outputFile=$REPORT_DIR/junit.xml --coverage.enabled=true --coverage.reporter=lcov'
      }
      post {
        always {
          junit testResults: 'reports/junit.xml', allowEmptyResults: true
          archiveArtifacts artifacts: 'coverage/**,reports/junit.xml', allowEmptyArchive: true
        }
      }
    }

    stage('Code Quality') {
      steps {
        sh 'npm run lint'

        withSonarQubeEnv('sonarqube-server') {
          script {
            def scannerHome = tool 'SonarScanner'
            sh "${scannerHome}/bin/sonar-scanner -Dproject.settings=sonarqube-project.properties"
          }
        }
      }
    }

    stage('Security') {
      steps {
        sh 'mkdir -p $REPORT_DIR'

        sh 'npm audit --json > $REPORT_DIR/npm-audit.json || true'
        sh 'node scripts/security-audit-report.mjs $REPORT_DIR/npm-audit.json $REPORT_DIR/security-summary.txt'

        sh 'trivy fs --scanners vuln,secret --severity HIGH,CRITICAL --exit-code 1 --no-progress .'
        sh 'trivy image --severity HIGH,CRITICAL --exit-code 1 --no-progress $IMAGE_URI'
      }
      post {
        always {
          archiveArtifacts artifacts: 'reports/security-summary.txt,reports/npm-audit.json', allowEmptyArchive: true
        }
      }
    }

    stage('Deploy to Staging') {
      steps {
        sh 'docker compose -f ci/docker-compose.staging.yml down --remove-orphans || true'
        sh 'IMAGE_REPO=$IMAGE_REPO IMAGE_TAG=$IMAGE_TAG docker compose -f ci/docker-compose.staging.yml up -d'
        sh 'curl -fsS http://localhost:$STAGING_PORT/health'
      }
    }

    stage('Approve Production Deployment') {
      when {
        anyOf {
          branch 'main'
          tag '*'
        }
      }
      steps {
        timeout(time: 15, unit: 'MINUTES') {
          input message: "🚀 Promote STAGING build #${env.BUILD_NUMBER} to PRODUCTION?", ok: 'Deploy to Prod'
        }
      }
    }

    stage('Deploy to Production') {
      when {
        anyOf {
          branch 'main'
          tag '*'
        }
      }
      steps {
        sh '''
          docker tag "$IMAGE_URI" "$IMAGE_REPO:$PROD_IMAGE_TAG"

          IMAGE_REPO="$IMAGE_REPO" IMAGE_TAG="$PROD_IMAGE_TAG" PROD_PORT="$PROD_PORT" \
            docker compose -f ci/docker-compose.prod.yml down --remove-orphans || true

          IMAGE_REPO="$IMAGE_REPO" IMAGE_TAG="$PROD_IMAGE_TAG" PROD_PORT="$PROD_PORT" \
            docker compose -f ci/docker-compose.prod.yml up -d

          curl -fsS "http://localhost:$PROD_PORT/health"
        '''
      }
    }

    stage('Monitoring (New Relic Deployment Marker)') {
      when {
        anyOf {
          branch 'main'
          tag '*'
        }
      }
      steps {
        sh '''
          if [ -n "$NEW_RELIC_API_KEY" ] && [ -n "$NEW_RELIC_ACCOUNT_ID" ]; then
            curl -sS -X POST "https://api.newrelic.com/graphql" \
              -H "Content-Type: application/json" \
              -H "API-Key: $NEW_RELIC_API_KEY" \
              -d "{\"query\":\"mutation { changeTrackingCreateDeployment(deployment: { version: \\\"$IMAGE_TAG\\\", user: \\\"jenkins\\\", description: \\\"$IMAGE_URI deployed to production\\\", entityGuid: \\\"$NEW_RELIC_ENTITY_GUID\\\" }) { deploymentId } }\"}"
          else
            echo "Skipping New Relic deployment marker (missing credentials)"
          fi
        '''
      }
    }
  }

  post {
    always {
      cleanWs()
    }
    failure {
      echo 'Pipeline failed. Check logs, tests, quality, or security stages.'
    }
  }
}