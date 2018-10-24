#!/bin/bash

GOOGLE_CLOUD_PROJECT='my-google-project'
SA_NAME='my-service-name'
CRED_FILENAME=credentials.json

gcloud iam service-accounts create $SA_NAME
# TODO: make these more fine grained permissions
gcloud projects add-iam-policy-binding $GOOGLE_CLOUD_PROJECT --member serviceAccount:${SA_NAME}@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role roles/pubsub.publisher
gcloud iam service-accounts keys create ${CRED_FILENAME} --iam-account ${SA_NAME}@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com
