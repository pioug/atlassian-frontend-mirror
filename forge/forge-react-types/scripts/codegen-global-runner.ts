import { generateGlobalComponentPropTypes } from './codegen/globalComponentPropTypes';

const runTypeCheck = () => {
	// execute yarn run check-types
	const { execSync } = require('child_process');
	try {
		execSync('yarn run check-types', { stdio: 'inherit' });
		// eslint-disable-next-line no-console
		console.log('✅ 🚀 Type checks passed successfully for generated Global component types!');
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('❌ Type checks failed:', error);
		process.exit(1);
	}
};

generateGlobalComponentPropTypes();
runTypeCheck();
