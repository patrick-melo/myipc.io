#!/bin/bash

function prd() {
    node index
}

function debug() {
    sleep 999999999
}

function dev() {
    echo "=> start post 3000 and wait for it to become available"
    cd /usr/app/react && npm start&
    while [ 1 ] ; do
        curl -s http://localhost:3000
        [ $? -eq 0 ] && break
        sleep 1
    done

    echo "=> start port 2000"
    cd /usr/app && node index
}

git describe --dirty | tee VERSION
prd
