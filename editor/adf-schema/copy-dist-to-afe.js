/**
 * This script is used to copy the ADF Schema DIST to the AFE node_modules folder
 * so that we can test AFE with the latest ADF Schema changes.
 *
 * This script is not used in CI, it is only used by developers to test AFE with the latest ADF Schema changes.
 *
 * Start AFE server with `yarn start <package-name>` in a seperate terminal.
 *
 * To run this script, cd into adf-schema/packages/adf-schema and provide the path to the AFE node_modules folder
 * as the first argument. For example: yarn link:afe '/Users/user/atlassian-frontend/node_modules/@atlaskit/adf-schema/dist'.
 *
 * Hot reloading is not supported, so you will need to rerun this script every time you make a change to the ADF Schema that
 * you want to test in AFE.
 *
 * Do a fresh yarn install in AFE to clear the node_modules changes made by this script when finished.
 */

const fs = require('fs-extra');

const errorMsg =
	'Please provide the absolute path to atlassian-frontend/node_modules/@atlaskit/adf-schema/dist';

if (!process.argv[2]) {
	// eslint-disable-next-line no-console
	console.log(errorMsg);
	process.exit(1);
}

const AFE_PATH = process.argv[2];
const ADF_SCHEMA_PATH = `${process.cwd()}/dist`;

fs.copy(ADF_SCHEMA_PATH, AFE_PATH, (err) => {
	// eslint-disable-next-line no-console
	console.log('Copied: ', ADF_SCHEMA_PATH, ' to ', AFE_PATH);
});
