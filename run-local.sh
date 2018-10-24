export GOOGLE_APPLICATION_CREDENTIALS=credentials.json
export GOOGLE_CLOUD_PROJECT=my-google-project

node index.js | ./node_modules/.bin/bunyan
