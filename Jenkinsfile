pipeline {

    agent any

    options {
        skipDefaultCheckout(true) // jenkins automatically do  checkout so we are mnetioning taht dont do automaticallly we are managin it 
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