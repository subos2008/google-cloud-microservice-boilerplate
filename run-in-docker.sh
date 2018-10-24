docker build -t edge50 .

docker run --rm -it -p 80:80 -v $PWD:/secrets/gcloud/ index.js
