#!/bin/bash
STARTERS=$(ls starters)
BASE_DIR=$(pwd)

for starter in $STARTERS
do
  cd $BASE_DIR
  cd starters/$starter
  yarn
  yarn lint
done
