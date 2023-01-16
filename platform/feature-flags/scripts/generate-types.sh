#!/usr/bin/env bash

if [ ! -d "dist" ]; then
    mkdir dist
fi

if [ ! -f "dist/generate-types.js" ]; then
    npm run build-typegenerator
fi

node ./dist/generate-types.js
./scripts/update-built-types.sh
