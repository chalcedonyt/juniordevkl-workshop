# Deploying Applications

## How do apps get deployed?

You have written your amazing app, how do you deploy it? This workshop covers a few common ways.

![alt text](https://storage.googleapis.com/appivo-websites/www/2017/12/5a7fa863-cloudnative.png "How do we deploy an app?")

Click the **Start** button to move to the next step.


## What is Cloud Shell?

Before we start, let's familiarize ourselves with the environment.

Cloud Shell is a free, serverless console for Google Cloud that comes packaged with key tools like:
* The `gcloud` CLI (Command Line Interface), which executes commands in your Google Cloud project.
* `git`, a tool to track changes in code, and distribute it.

*** 

Let's familiarize ourselves with the Cloud Shell environment. Click "Next" below.
> **Note**: Some of these tips can be applied to most terminals you encounter, like MacOS Terminal or Windows Powershell!

## Navigating the console

Here's an example of a command you can execute. Either type in the command to your terminal, or click the <walkthrough-cloud-shell-icon></walkthrough-cloud-shell-icon> icon below

```bash
gcloud projects list
```

* `gcloud` is the program you are running.
* `projects` is a **parameter** to `gcloud`, and `list` is in turn a **parameter** to `projects`.

### Options and arguments

Try adding the `--help` option to the command from before:

```bash
gcloud projects list --help
```

You should see text explaining what this command does. `--help` is a common option you can use in many programs that explains commands and their parameters. Try executing

```bash
gcloud projects --help
```

This shows other parameters you can pass to `gcloud projects`.


### Set your active project
Configure the `gcloud` tool to use your current project. Replace PROJECT_ID with your project id below:

```bash
gcloud config set project PROJECT_ID
```

Click **Next** to continue setting up the application.

## Understanding the application

Before we deploy an application, we'll need to understand how it works. 
The application is based on a [Firestore lab by Google Cloud](https://codelabs.developers.google.com/codelabs/firestore-web/#0) - read it to understand how to run the application.

INSERT ARCHITECTURE HERE.

## Setting up Firestore

### Creating a Firebase project

This application uses Firestore (which requires a Firebase project) to store its data.
Open the Firebase console at https://console.firebase.google.com/ and Create a project, selecting the project that you have created. ***(Don't create a new project!)***

Select the Blaze (Pay as you go) plan - don't worry, you should be staying well within the free tier in this lab.

### Create your Firestore Database

Firestore is a managed NoSQL database on Google Cloud Platform. Create a firestore database by clicking on Database > Create database from the right panel. 

![alt text](https://raw.githubusercontent.com/chalcedonyt/gcp-gke-workshop/master/tutorial-images/Firestore.png "Creating firebase instance")

* Select "Start in production mode", then choose a region (`asia-south1-a` is recommended).

## Installing and previewing the application 
```bash
npm install
```

```bash
npm start
```

Click the preview icon on the top right <walkthrough-web-preview-icon></walkthrough-web-preview-icon>

This opens a public URL into port 8080 of your Cloud Shell by default.

**Question**: Can you see the problem with this?

Deploying the application to the public

## Deploying to Google App Engine

So far our application only lives on our private Cloud Shell proxy, and will be deleted when we close Cloud Shell.

Let's deploy to Google App Engine (GAE)

GAE requires an `app.yaml` file to describe how GAE should deploy an application. <walkthrough-editor-open-file filePath="app.yaml">Open the file</walkthrough-editor-open-file> and look at it.

Use the `gcloud` tool to deploy to GAE:
```bash
gcloud app deploy
```

Click **Next** after this completes.

## How an App Engine app works.

Wow, that was quick, wasn't it?

Questions:
* Why do you think `app.yaml` specified NodeJS 10?
* There isn't much else. How do you think GAE is deploying the app?

Next up - we'll deploy using Cloud Run.

## Building a container, and deploying to Cloud Run.

### Building the container
Cloud Run works off containers. So we'll need to deploy our app as a container.

Run the command below, replacing PROJECT_ID with your project id ({{project-id}})
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/app:v1
```

Let's break down the image name here (the value passed to `tag`):
* gcr.io stands for Google Container Registry, a container repository hosted by GCP.
* gcr.io/PROJECT_ID is a namespace automatically allocated to your project.
* app:v1 is the image:tag that you have chosen.

Click **Next** below to use your container in Cloud Run.

## Deploying to Cloud Run

```bash
gcloud run deploy tasklist --image=gcr.io/junior-devops/app:v1
```

Where `tasklist` is the name we are giving to the service.

* When asked for a target platform, choose Option 1 ["`Cloud Run (fully managed)`"]
* When asked to enable the Cloud Run service, answer `y`.
* When asked to specify a region, choose any region.

This operation may take a while as the Cloud Run API is being enabled.

You should see a message saying that
```
Service [tasklist] revision [REVISION] has been deployed and is serving 100 percent of traffic at [URL].
```

Note the URL that is generated. Opening it will show you the app.

GAE and Cloud Run have really easy deployment strategies so far. But what if we needed more customization and control?

## What Kubernetes does

Kubernetes is a container orchestration engine.

A Kubernetes **Cluster** comprises nodes (VMs). It deploys containers to these nodes to achieve things like:
* Load-balancing
* Secret management
* Custom configuration

Let's create our first Kubernetes cluster.

```bash
gcloud container clusters create my-cluster \
  --region=asia-southeast1-a \
  --num-nodes=1 \
  --machine-type=g1-small \
  --no-enable-cloud-logging \
  --no-enable-cloud-monitoring \
  --no-enable-stackdriver-kubernetes
```