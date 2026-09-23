import { generateComponentPropTypes } from './codegen';

const runTypeCheck = () => {
	// execute yarn run check-types
	const { execSync } = require('child_process');
	try {
		execSync('yarn run check-types', { stdio: 'inherit' });
		// eslint-disable-next-line no-console
		console.log('✅ 🚀 Type checks passed successfully for generated UIKit component types!');
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('❌ Type checks failed:', error);
		process.exit(1);
	}
};

if (process.argv.length < 3) {
	generateComponentPropTypes();
} else {
	// e.g afm workspace @atlaskit/forge-react-types codegen Button
	//     or afm workspace @atlaskit/forge-react-types codegen Button,Code
	const componentPropTypeFilter = process.argv[2];
	generateComponentPropTypes(componentPropTypeFilter);
}

runTypeCheck();
