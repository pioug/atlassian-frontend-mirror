#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs');
const path = require('path');

let entrypoint = path.join(__dirname, 'dist', 'cjs', 'index.js');
if (!fs.existsSync(entrypoint)) {
	throw new Error(
		'@atlaskit/ads-mcp is not distributed; if you are trying to run this locally, please run `yarn build @atlaskit/ads-mcp` first.',
	);
}

require(entrypoint);
