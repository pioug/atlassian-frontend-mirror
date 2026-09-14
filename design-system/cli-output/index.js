/* eslint-disable global-require, import/no-extraneous-dependencies */

const fs = require('fs');
const path = require('path');

const isDev = fs.existsSync(path.join(__dirname, 'tsconfig.json'));
if (isDev) {
	require('@atlassian/ts-loader');
}

// Keep both branches literal so the import/no-dynamic-require rule can verify the package entrypoint.
module.exports = isDev ? require('./src/index') : require('./dist/cjs/index');
