
FROM node:8

WORKDIR /app

COPY package.json /app/
COPY yarn.lock /app/

RUN set -ex && yarn install

COPY index.js /app/
COPY lib /app/lib
COPY service-lib /app/service-lib

ENV GOOGLE_CLOUD_PROJECT my-service-name

# mount your credentials at /secrets/gcloud/credentials.json
# this location is set in the Chart
ENV GOOGLE_APPLICATION_CREDENTIALS /secrets/gcloud/credentials.json

ENV PORT 80
EXPOSE 80
CMD node index.js
