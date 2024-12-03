export const getReactionsConfig = () => {
	let reactionsConfig;
	try {
		// eslint-disable-next-line @repo/internal/import/no-unresolved
		reactionsConfig = require('../../local-config')['default'];
	} catch (e) {
		reactionsConfig = require('../../local-config-example')['default'];
	}

	return reactionsConfig;
};
