#!/usr/bin/env bash

VERSION=`grep "LABEL version" Dockerfile | cut -d'"' -f2`
IMAGE_VERSION="faforever/faf-scfa-replay-api:$VERSION"

docker stop faf-scfa-replay-api
docker rm faf-scfa-replay-api
docker run -d --restart=always --name faf-scfa-replay-api -p 13666:13666 $IMAGE_VERSION
docker run -d --restart=always --name faf-scfa-replay-api -p 13666:13666 faf-scfa-replay-api
echo "Container started $IMAGE_VERSION"
