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
        sh 'npx vitest run --reporter=default --reporter=junit --outputFile=$REPORT_DIR/junit.xml --coverage.enabled=true --coverage.reporter=lcov --coverage.reporter=text'
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
          sh 'sonar-scanner -Dproject.settings=sonarqube-project.properties'
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

    stage('Deploy') {
      steps {
        sh 'IMAGE_REPO=$IMAGE_REPO IMAGE_TAG=$IMAGE_TAG docker compose -f ci/docker-compose.staging.yml up -d'
        sh 'curl -fsS http://localhost:8080/health'
      }
    }

    stage('Release') {
      when {
        anyOf {
          branch 'main'
          tag '*'
        }
      }
      steps {
        input message: 'Promote staging build to production?', ok: 'Release'
        sh '''
          docker tag $IMAGE_URI $IMAGE_REPO:latest
          # Replace with your registry login/push when available.
          # docker login -u $REGISTRY_USER -p $REGISTRY_PASS $REGISTRY_URL
          # docker push $IMAGE_URI
          # docker push $IMAGE_REPO:latest
        '''
        sh '''
          # Replace with production deploy command, e.g. SSH + compose/Kubernetes.
          echo "Production release placeholder executed for $IMAGE_URI"
        '''
      }
    }

    stage('Monitoring') {
      when {
        anyOf {
          branch 'main'
          tag '*'
        }
      }
      steps {
        sh '''
          # New Relic deployment marker. Requires NEW_RELIC_API_KEY and NEW_RELIC_ACCOUNT_ID.
          if [ -n "$NEW_RELIC_API_KEY" ] && [ -n "$NEW_RELIC_ACCOUNT_ID" ]; then
            curl -sS -X POST "https://api.newrelic.com/graphql" \
              -H "Content-Type: application/json" \
              -H "API-Key: $NEW_RELIC_API_KEY" \
              -d "{\"query\":\"mutation { changeTrackingCreateDeployment(deployment: { version: \\\"$IMAGE_TAG\\\", user: \\\"jenkins\\\", description: \\\"Release $IMAGE_URI deployed to production\\\", entityGuid: \\\"$NEW_RELIC_ENTITY_GUID\\\" }) { deploymentId } }\"}";
          else
            echo "New Relic credentials not configured; skipping deployment marker."
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
      echo 'Pipeline failed. Check test, quality, and security reports under archived artifacts.'
    }
  }
}
