#!/usr/bin/env node
/* eslint-disable */

const fs = require('fs');
const path = require('path');
const project = path.join(__dirname, '../tsconfig.json');
const dev = fs.existsSync(project);

if (dev) {
  require('ts-node').register({ project });
}

require(path.join('..', dev ? 'src/index.ts' : 'dist/cjs/index.js')).main();
