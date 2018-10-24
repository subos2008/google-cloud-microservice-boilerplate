# Google Cloud Microservice Boilerplace Code

This code integrates with Google Cloud by:

1. providing a logger based on bunyan that outputs json formatted logs in a format parsed by Google's log ingestion service
1. Providing `/ready` and `/health` endpoints that Google Cloud uses to determine if a service is alive and healthy. See `./lib/health_monitor.js`
1. Providing a class that publishes messages as text to Google PubSub `system-alerts` topic. These are then forwarded to to the user by other microservices.

## Setup

### Set your service name and google project id

1. Search and replace in the source code for `my-service-name` and replace it with a slug for your service. 
1. Search and replace in the source code for `my-google-project` and replace it with the ID of your Google project.

### Setup Google Cloud

First run `./setup-gcloud.sh` which creates the service account and
grants basic permissions.

*Note: TODO: this uses legacy permissions on Google Cloud, this should be hardened up to use role based permissions*

You need to create the pubsub topic. Look up the directory tree for the `pub-sub/` dir which has batch scripts for this. Something like:

```
# gcloud pubsub topics create system-alerts
```

### Setup Kubernetes

First set the namespace in the env. Note this **needs to match everywhere, including GitLab's auto deployment setup**.

```bash
export KUBERNETES_NAMESPACE=my-service-name
```

Upload the Google service account credentials to GKE with:

```
kubectl create namespace $KUBERNETES_NAMESPACE
kubectl create secret generic my-service-name-service-account \
    --namespace=$KUBERNETES_NAMESPACE --from-file=credentials.json=credentials.json
```

Upload any credentials with:

```bash
# replace ... with the actual values
PUBLIC_API_KEY= ...
SECRET_PRIVATE_KEY= ...
kubectl create secret generic tr-binance-credentials \
    --namespace=$KUBERNETES_NAMESPACE \
    --from-literal=PUBLIC_API_KEY=$PUBLIC_API_KEY \
    --from-literal=SECRET_PRIVATE_KEY=$SECRET_PRIVATE_KEY
```

# GitLab Auto Deployment

**Note you must set the namespace to the same value for GitLab and the kubernetes secrets or the containers will get
stuck in creation because they can't see their secrets.**

To get the token:

```
kubectl describe secret gitlab-token-abcde
```

To get the certificate:

```
.. hmm maybe just copy it from an existing job
```
