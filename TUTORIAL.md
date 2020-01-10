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

Before we proceed, we will be using your project ID a lot, so let's export it as a variable.

Replace `[PROJECT_ID]` below with your actual project ID. This command sets a variable in your shell.

```bash
export PROJECT_ID=[PROJECT ID]
```

Test it by echoing the value:
```bash
echo $PROJECT_ID
```

Now `$PROJECT_ID` can be used to refer to your project ID.

Click **Next** when you are prompted to move to step 2.

This will happen after setting up Firebase, creating a service acount, and downloading its key.

## Copying the service account key into the application code

You should have downloaded a service account key in JSON format. 

Save it (the filename doesn't matter) and open it.

Open <walkthrough-editor-open-file filePath="juniordevkl-workshop/credentials/svc-account.json" text="credentials/svc-account.json"></walkthrough-editor-open-file> in your editor.

You'll notice it currently has dummy values. Paste the content of the file you just downloaded into this file, then Save it.

This will ensure that the application can connect to Firestore!

## Installing and previewing the application 

Developers usually place install and running instructions in  <walkthrough-editor-open-file filePath="juniordevkl-workshop/README.md" text="the README.md file"></walkthrough-editor-open-file>.

We have already replaced the service account credential. Now install the dependencies:

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

Configure the `gcloud` tool to use your current project:

```bash
gcloud config set project $PROJECT_ID
```

Then run `gcloud app deploy` again.

What do you think the progress output means?

### After deploying 

Note the `target url` that appears after this completes, and open it in your browser.

```
descriptor:      [/home/chalcedonyt/juniordevkl-workshop/app.yaml]
source:          [/home/chalcedonyt/juniordevkl-workshop]
target project:  [jd-project-tim]
target service:  [default]
target version:  [20200107t234055]
target url:      [https://jd-project-tim.appspot.com]
```

## Building a container, and deploying to Cloud Run.

### Building the container image from a Dockerfile.

A **Dockerfile** specifies how a container image is built. 

Open the <walkthrough-editor-open-file filePath="Dockerfile" text="Dockerfile"></walkthrough-editor-open-file> in the project and look at it.

What do you think the directives mean?

Run this command to build the **container image**.

```bash
docker build -t app:v1.0.0 .
```

Remember that containers are **portable**. We can even run this one locally!

Use this command:

```bash
docker run -p 3000:3000 app:v1.0.0
```

Then do the preview again <walkthrough-web-preview-icon></walkthrough-web-preview-icon> to view the app.

Note that the DEPLOYER value has changed to the one from the Dockerfile.

Click Next to proceed.

## Deploying to Cloud Run

To submit our image from our local Cloud Shell to the cloud, we must indicate that we want to push it to Google Container Registry, under our project.

Run this command to create an alias of `app:v1.0.0`:
```bash
docker tag app:v1.0.0 gcr.io/$PROJECT_ID/app:v1.0.0
```

Then push it to GCR (Google Container Registry):
```bash
docker push gcr.io/$PROJECT_ID/app:v1.0.0
```

Let's break down the image name here (the value passed to `tag`):
* **gcr.io** stands for Google Container Registry, a container repository hosted by GCP.
* **gcr.io/$PROJECT_ID** is a namespace automatically allocated to your project.
* **app:v1.0.0** is the image:tag that you have chosen.

Click **Next** below to use your container in Cloud Run.

## Deploying to Cloud Run

```bash
gcloud run deploy todolist --image=gcr.io/$PROJECT_ID/app:v1.0.0 --set-env-vars=DEPLOYER=CloudRun --memory=128Mi
```

Where `todolist` is the name we are giving to the service.

* When asked for a target platform, choose Option 1 ["`Cloud Run (fully managed)`"]
* When asked to enable the Cloud Run API, answer `y`. This takes a while.
* When asked to specify a region, choose any region.
* When asked to allow "unauthenticated invocations", allow it.

You should see a message saying that
```
Service [todolist] revision [REVISION] has been deployed and is serving 100 percent of traffic at [URL].
```

Note the URL that is generated. Opening it will show you the app! Notice that we set the DEPLOYER environment variable when deploying the service.

## Creating the cluster

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

[BREAK]

## Creating a Deployment and Service

Create the Deployment and Service.

Open <walkthrough-editor-open-file filePath="k8s/app.yml" text="k8s/app.yml"></walkthrough-editor-open-file>.
Find the section that says 

`image: gcr.io/PROJECT_ID/app:v1.0.0`.

Replace your `PROJECT_ID` here.

Then create the Deployment

```bash
kubectl apply -f k8s/app.yml
```

Next, create an Ingress.

```bash
kubectl apply -f k8s/ingress.yml
```

Ingresses take a lot of time to deploy - can you guess why?

Let's talk about what just happened, then let's revise what we have learnt.

## Modifying a deployed app

Although containers are **immutable** one of the main benefits of Kubernetes is its flexibility.

In production it is a **bad practice** to build images with service account credentials in them! 

With Kubernetes, we can instead **mount** confidential values (called Secrets) as volumes or environment variables into a running container.

Create a secret from the service account key with this command:

```bash
kubectl create secret generic credential-secret --from-file=credentials/svc-account.json
```

Verify that this was done:
```bash
kubectl describe secrets credential-secret
```

Click Next to continue.

## Deploying the image WITHOUT the baked in credential.

Let's try to rebuild the image WITHOUT the baked in credential.

DELETE the `credentials/svc-account.json` file from your code.

Then build the image again, this time tagging it to `app:v1.0.1` (instead of app:v1.0.0 like we did earlier).

```bash
docker build -t gcr.io/$PROJECT_ID/app:v1.0.1 .
```
```bash
docker push gcr.io/$PROJECT_ID/app:v1.0.1
```

Next, look at <walkthrough-editor-open-file filePath="k8s/app-with-secret.yml" text="k8s/app-with-secret.yml"></walkthrough-editor-open-file>.

Replace PROJECT_ID in here, then apply it. Note that this file uses the new tag and creates a volume.

```bash
kubectl apply -f k8s/app-with-secret.yml
```

Open the Kubernetes console - you'll notice that a "Rolling update" occurs. Verify that the app still runs!

**Question**: What do you think will happen if we don't mount the credential volume?