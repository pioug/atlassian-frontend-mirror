/* oxlint-disable eslint-core-js/global-require -- Existing file-level ESLint disable uses original core rule IDs; Oxlint JS plugins report namespaced IDs. */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
// Used only for internal repo usage.
const path = require('path');

if (!require.extensions['.ts']) {
	// ts-node can only handle being registered once, see https://github.com/TypeStrong/ts-node/issues/409
	require('ts-node').register({
		project: path.join(__dirname, 'tsconfig.json'),
	});
}
module.exports = require('./src/index');
