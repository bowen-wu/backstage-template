#!/bin/bash
source /etc/profile

# node version 12
node_version=$1
env=$2
nvm use $node_version
yarn install
if [ $env == production ]
then
    echo 'prod env'
    yarn build:prod
else
    echo 'dev env'
    yarn build:dev

cd dist
zip -r ../aldt-collection.zip *
cd ..
rm -rf dist
fi
