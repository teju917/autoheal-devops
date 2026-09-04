pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Install') {
            steps {
                bat 'cd backend && npm install'
            }
        }

        stage('Frontend Install') {
            steps {
                bat 'cd frontend && npm install'
            }
        }

        stage('Frontend Build') {
            steps {
                bat 'cd frontend && npm run build'
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