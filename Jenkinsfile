pipeline {
 agent any

 environment {
   IMAGE_NAME = "raj0pro/frontend"
   IMAGE_TAG = "v1.0.${BUILD_NUMBER}"
   APP_NAME = "frontend"
 }

 stages {

   stage('Build Docker Image') {

     steps {

       withCredentials([
         usernamePassword(
           credentialsId: 'dockerhub-creds',
           usernameVariable: 'DOCKER_USER',
           passwordVariable: 'DOCKER_PASS'
         )
       ]) {

         sh '''
         docker build -t $IMAGE_NAME:$IMAGE_TAG .

         echo $DOCKER_PASS | docker login \
         -u $DOCKER_USER \
         --password-stdin

         docker push $IMAGE_NAME:$IMAGE_TAG
         '''
       }
     }
   }

   stage('Update GitOps Repo') {

     steps {

       withCredentials([
         string(
           credentialsId: 'github-bot-token',
           variable: 'GIT_TOKEN'
         )
       ]) {

         sh '''
         git clone \
         https://${GIT_TOKEN}@github.com/Raj-pro/k8s-config.git

         cd k8s-config

         git config user.email "jenkins@demo.com"
         git config user.name "Jenkins Bot"

         sed -i \
         "s|image: .*|image: $IMAGE_NAME:$IMAGE_TAG|g" \
         frontend/deployment.yaml

         git add .

         git commit -m "Deploy $IMAGE_TAG"

         git push origin main
         '''
       }
     }
   }

   stage('Trigger ArgoCD') {

     steps {

       withCredentials([
         string(
           credentialsId: 'argocd-token',
           variable: 'ARGOCD_TOKEN'
         )
       ]) {

         sh '''
         argocd app sync $APP_NAME \
         --auth-token $ARGOCD_TOKEN \
         --server argocd-server

         argocd app wait $APP_NAME \
         --auth-token $ARGOCD_TOKEN \
         --server argocd-server
         '''
       }
     }
   }
 }
}
