#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
/* eslint-disable global-require */
// Used only for internal repo usage.
const fs = require('fs');
const path = require('path');

const project = path.join(__dirname, '../tsconfig.json');
const dev = fs.existsSync(project);

if (dev) {
	require('ts-node').register({ project });
}

require(path.join('..', dev ? 'src/cli' : 'dist/cjs/cli'));
