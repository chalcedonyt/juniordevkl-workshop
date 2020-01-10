# JuniorDev KL LearnUp #1 - Deploying Applications

By Timothy Teoh

## Welcome to the workshop!

You have an amazing app, how do you deploy it? 
This workshop covers a few common ways.

This sidebar walkthrough will contain helpful commands and links that go with the slides you see in front.

Click the **Start** button WHEN PROMPTED to move to the next step. 

The slides will remind you where you should be in this walkthrough.

## Your environment

Here's an example of how this sidebar can help. 

Click the <walkthrough-cloud-shell-icon></walkthrough-cloud-shell-icon> icon in the code snippets below to paste them into your cloud shell.

```bash
gcloud projects list
```

```bash
gcloud projects list --help
```

Click **Next** when you are prompted to move to step 2.
This will happen after setting up Firebase, creating a service acount, and downloading its key.

## Copying the service account key into the application code

You should have downloaded a service account key in JSON format. 

Save it (the filename doesn't matter) and open it.

Open <walkthrough-editor-open-file filePath="juniordevkl-workshop/credentials/svc-account.json" text="credentials/svc-account.json"></walkthrough-editor-open-file> in your editor.

You'll notice it currently has dummy values. Paste the content of the file you just downloaded into this file, then Save it.

This will ensure that the application can connect to Firestore!

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
