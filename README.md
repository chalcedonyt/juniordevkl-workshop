# Junior Dev KL Deployment Workshop

## Introduction

This repository is a demo for a Junior Dev KL workshop to learn how to handle deployments into Google App Engine, Cloud Run, and Google Kubernetes Engine.

## Usage

Use the link below or open TUTORIAL.md .

[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.svg)](https://ssh.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https://github.com/chalcedonyt/juniordevkl-workshop.git&tutorial=TUTORIAL.md)

Credits to https://github.com/m081779/express-handlebars-todo-list for the original todo demo.

## Running the application

* A Firestore database is required to run this application. The service account key should be placed in `credentials/svc-account.json`.
* Run `npm install` to install the app dependencies.
* Run `npm start` to start the application. 

The application will run on port 3000 or the `PORT` variable.

The `DEPLOYER` variable (defaulting to "Local") can also be overridden and will display on the home page.