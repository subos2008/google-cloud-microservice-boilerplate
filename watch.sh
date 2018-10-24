fswatch -r -o . --exclude yarn-error.log | xargs -n1 ./test.sh
