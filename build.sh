#!/bin/bash
clear
docker build -t test . &&
  docker run \
    -it --rm \
    -u 1000 \
    -v /home/peter/tmp/clipident:/frames \
    --shm-size=256m \
    test \
    ./run.sh
