#!/usr/bin/env node
/* eslint-disable */
const path = require('path');
const project = path.join(__dirname, 'tsconfig.json');

const entrypoint = path.join(__dirname, 'src', 'index');
if (!require.extensions['.ts']) {
	require('ts-node').register({ project });
}

require(entrypoint);
