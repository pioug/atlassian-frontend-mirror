#!/usr/bin/env node

/**
 * This is a custom `main` entrypoint that switches between source/dist depending on environment
 */
/* eslint-disable global-require,import/no-dynamic-require,import/no-extraneous-dependencies */
require('@atlassian/ts-loader');

const fs = require('fs');
const path = require('path');

const project = path.join(__dirname, 'tsconfig.json');
const dev = fs.existsSync(project);

let entrypoint = path.join(__dirname, 'dist', 'cjs', 'index');
if (dev) {
	entrypoint = path.join(__dirname, 'src', 'index');
}

module.exports = require(entrypoint);
