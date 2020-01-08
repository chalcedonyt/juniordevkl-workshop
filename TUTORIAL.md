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

Click **Next** and we'll continue setting up the application.

## Understanding the application

Before we deploy an application, we'll need to understand how it works. 
The application is based on a [Firestore lab by Google Cloud](https://codelabs.developers.google.com/codelabs/firestore-web/#0) - read it to understand how to run the application.

INSERT ARCHITECTURE HERE.

## Setting up the data layer with Firestore

### Creating a Firebase project

This application uses Firestore (which requires a Firebase project) to store its data. 
Open the Firebase console at [https://console.firebase.google.com/](https://console.firebase.google.com/) and Create a project, selecting the project that you have created. ***(Don't create a new project!)***

Select the Blaze (Pay as you go) plan - don't worry, you should be staying well within the free tier in this lab.

When prompted about Google Analytics, don't enable it for the project.

### Create your Firestore Database

Firestore is a managed NoSQL database on Google Cloud Platform. Create a firestore database by clicking on Database > Create database from the right panel. 

![alt text](https://raw.githubusercontent.com/chalcedonyt/juniordevkl-workshop/master/tutorial-images/Firestore.png "Creating firebase instance")

* Select "Start in production mode", then choose a region (`asia-south1-a` is recommended).

Next we will create the credentials so our app can connect to Firestore.

## Creating a service account

A service account is a common way to secure server-to-server communications. We'll create one, and generate a key against it and put it in our app.

Go to [https://console.cloud.google.com/](Google Cloud Console) and either search for "Service Account", or go to IAM -> Service account using the sidebar.

![alt text](https://raw.githubusercontent.com/chalcedonyt/juniordevkl-workshop/master/tutorial-images/iam1.png "Navigating to IAM->Service account")

Click on "Create a service account".

![alt text](https://raw.githubusercontent.com/chalcedonyt/juniordevkl-workshop/master/tutorial-images/iam2.png "Creating a service account")

Give the service account a descriptive name, and click "Create".

![alt text](https://raw.githubusercontent.com/chalcedonyt/juniordevkl-workshop/master/tutorial-images/iam3.png "Naming a service account")

The next part is the most important. We want to grant the service account only the access that it needs. 

## Granting service account access

In the next dialog, search for the "Firebase Develop Admin" role. Then click "Continue"

![alt text](https://raw.githubusercontent.com/chalcedonyt/juniordevkl-workshop/master/tutorial-images/iam4.png "Granting access")

In the final step, download the service account key in JSON format. Save it (the filename doesn't matter) and open it.

Open <walkthrough-editor-open-file filePath="juniordevkl-workshop/credentials/svc-account.json" text="credentials/svc-account.json"></walkthrough-editor-open-file> in your editor.

You'll notice it currently has dummy values. Paste the content of the file you just downloaded into this file, then Save it.

Your app should now be able to access Firestore!

## Installing and previewing the application 

Install the dependencies of the app:

```bash
npm install
```

Then start the application:

```bash
npm start
```

The application has started in your Cloud Shell, but how do you actually view it?

Click the preview icon on the top right <walkthrough-web-preview-icon></walkthrough-web-preview-icon>

This opens a public URL into your Cloud Shell on port 8080 (by default).


**Question**: Can you see the problem with this?

Press CTRL+C to terminate the current command (`npm start`).

Deploying the application to the public

## Deploying to Google App Engine

So far our application only lives on our private Cloud Shell proxy, and will be deleted when we close Cloud Shell.

**Note**: The "port forwarding" concept from the previous step is an important one

Let's deploy to Google App Engine (GAE)

GAE requires an `app.yaml` file to describe how GAE should deploy an application. <walkthrough-editor-open-file filePath="juniordevkl-workshop/app.yaml" text="Open the file"></walkthrough-editor-open-file> and look at it.

Use the `gcloud` tool to deploy to GAE:
```bash
gcloud app deploy
```

### Set your active project
But whoops! Looks like we need to configure the current project.

Configure the `gcloud` tool to use your current project. Replace PROJECT_ID with your project id below:

```bash
gcloud config set project PROJECT_ID
```

Then run `gcloud app deploy` again.

Talk a little about the output.

```
descriptor:      [/home/chalcedonyt/juniordevkl-workshop/app.yaml]
source:          [/home/chalcedonyt/juniordevkl-workshop]
target project:  [jd-project-tim]
target service:  [default]
target version:  [20200107t234055]
target url:      [https://jd-project-tim.appspot.com]
```

Explain traffic split

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
gcloud builds submit --tag gcr.io/PROJECT_ID/app:v1.0.0
```

Let's break down the image name here (the value passed to `tag`):
* gcr.io stands for Google Container Registry, a container repository hosted by GCP.
* gcr.io/PROJECT_ID is a namespace automatically allocated to your project.
* app:v1.0.0 is the image:tag that you have chosen.

Click **Next** below to use your container in Cloud Run.

## Deploying to Cloud Run

```bash
gcloud run deploy tasklist --image=gcr.io/PROJECT_ID/app:v1.0.0
```

Where `tasklist` is the name we are giving to the service.

* When asked for a target platform, choose Option 1 ["`Cloud Run (fully managed)`"]
* When asked to enable the Cloud Run API, answer `y`.
* When asked to specify a region, choose any region.
* When asked to allow "unauthenticated invocations", allow it.

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

When you run this, you should get a warning similar to this:
```
ERROR: (gcloud.container.clusters.create) ResponseError: code=403, message=Kubernetes Engine API is not enabled for this project. Please ensure it is enabled in Google Cloud Console and try ag
ain: visit https://console.cloud.google.com/apis/api/container.googleapis.com/overview?project=PROJECT_ID to do so.
```

Visit this link and enable the Kubernetes API. Run the command above again after it completes. 

While we wait for the API to complete, let's talk about Kubernetes.

## Container vs VM Quiz

After the Kubernetes API has been enabled on your project, run the cluster creation command again:

```bash
gcloud container clusters create my-cluster \
  --region=asia-southeast1-a \
  --num-nodes=1 \
  --machine-type=g1-small \
  --no-enable-cloud-logging \
  --no-enable-cloud-monitoring \
  --no-enable-stackdriver-kubernetes
```

While that runs, let's take a bit of time to revise what we have learnt so far.

QUIZ LINK

Create the Deployment and Service.

Replace the `PROJECT_ID` in `k8s/app.yml`

```bash
kubectl apply -f k8s/app.yml
```

Next, create the Ingress.

```bash
kubectl apply -f k8s/ingress.yml
```

Ingress - takes a lot of time. 

Explain about the UI. Show scaling

## Modifying a deployed app

Although containers are **immutable** one of the main benefits of Kubernetes is its flexibility.

In production it is a **bad practice** to build images with service account credentials in them! 

With Kubernetes, we can instead **mount** confidential values (called Secrets) as volumes or environment variables into a running container.

Create a secret from the service account key with this command:

```bash
kubectl create secret generic credential-secret --from-file=credentials/svc-account.json
```

```bash
kubectl apply -f k8s/app-with-secret.yml
```

## Updating deployment image tags

Let's try to rebuild the image WITHOUT the baked in credential.

Delete the `credentials/svc-account.json` file from your code.

Then build the image again, this time tagging it to app:v1.0.1 (instead of app:v1.0.0 like we did earlier).

Remember to replace your project ID below:

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/app:v1.0.1
```

Update this tag into <walkthrough-editor-open-file filePath="k8s/app-with-secret.yml" text="k8s/app-with-secret.yml"></walkthrough-editor-open-file>

Then run the `apply` command again:

```bash
kubectl apply -f k8s/app-with-secret.yml
```

Open the Kubernetes console - you'll notice that a "Rolling update" occurs. Verify that the app still runs!
