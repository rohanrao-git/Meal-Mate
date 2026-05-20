pipeline {
  agent any

  parameters {
    booleanParam(name: 'RUN_PROD_DEPLOY', defaultValue: false, description: 'Run production approval + deployment even for manual dashboard runs.')
    booleanParam(name: 'RUN_MONITORING', defaultValue: false, description: 'Run monitoring stage even for manual dashboard runs.')
  }

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
    DEPLOY_TO_PROD = 'false'
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
        sh 'docker rm -f meal-mate-staging >/dev/null 2>&1 || true'
        sh 'docker compose -p meal-mate-staging -f ci/docker-compose.staging.yml down --remove-orphans || true'
        sh 'IMAGE_REPO=$IMAGE_REPO IMAGE_TAG=$IMAGE_TAG docker compose -p meal-mate-staging -f ci/docker-compose.staging.yml up -d'
        sh 'curl -fsS http://localhost:$STAGING_PORT/health'
      }
    }

    stage('Production Deployment Decision') {
      steps {
        script {
          if (params.RUN_PROD_DEPLOY) {
            env.DEPLOY_TO_PROD = 'true'
            echo 'RUN_PROD_DEPLOY=true -> production deployment enabled.'
          } else {
            try {
              timeout(time: 15, unit: 'MINUTES') {
                def approvedBy = input(
                  message: "Promote STAGING build #${env.BUILD_NUMBER} to PRODUCTION?",
                  ok: 'Deploy to Production',
                  submitterParameter: 'APPROVED_BY'
                )
                env.DEPLOY_TO_PROD = 'true'
                echo "Production approval granted by: ${approvedBy}"
              }
            } catch (err) {
              env.DEPLOY_TO_PROD = 'false'
              echo "Production approval not granted: ${err.getClass().getName()} - ${err.getMessage()}"
            }
          }
          echo "DEPLOY_TO_PROD=${env.DEPLOY_TO_PROD}"
        }
      }
    }

    stage('Deploy to Production') {
      when {
        expression { env.DEPLOY_TO_PROD == 'true' }
      }
      steps {
        sh '''
          docker rm -f meal-mate-production >/dev/null 2>&1 || true
          docker tag "$IMAGE_URI" "$IMAGE_REPO:$PROD_IMAGE_TAG"

          IMAGE_REPO="$IMAGE_REPO" IMAGE_TAG="$PROD_IMAGE_TAG" PROD_PORT="$PROD_PORT" \
            docker compose -p meal-mate-prod -f ci/docker-compose.prod.yml down --remove-orphans || true

          IMAGE_REPO="$IMAGE_REPO" IMAGE_TAG="$PROD_IMAGE_TAG" PROD_PORT="$PROD_PORT" \
            docker compose -p meal-mate-prod -f ci/docker-compose.prod.yml up -d

          curl -fsS "http://localhost:$PROD_PORT/health"
        '''
      }
    }

    stage('Monitoring (New Relic Deployment Marker)') {
      when {
        expression { params.RUN_MONITORING || env.DEPLOY_TO_PROD == 'true' }
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
