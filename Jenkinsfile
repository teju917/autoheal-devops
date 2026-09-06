// GitHub Webhook Test

pipeline {

    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Install') {
            steps {
                bat 'cd backend && npm ci'
            }
        }

        stage('Frontend Install') {
            steps {
                bat 'cd frontend && npm ci'
            }
        }

        stage('Code Quality Check') {
            steps {
                bat 'cd frontend && npm run lint'
            }
        }

        stage('Frontend Build') {
            steps {
                bat 'cd frontend && npm run build'
            }
        }

        stage('Docker Check') {
            steps {
                bat 'docker --version'
                bat 'docker compose version'
            }
        }
    }

    post {

        success {
            echo 'CI Pipeline completed successfully!'
        }

        failure {
            echo 'CI Pipeline failed!'
        }
    }
}