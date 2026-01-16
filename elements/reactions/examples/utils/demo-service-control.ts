export const getReactionsConfig = (): any => {
	let reactionsConfig;
	try {
		// eslint-disable-next-line @repo/internal/import/no-unresolved
		reactionsConfig = require('../../local-config')['default'];
		if (!reactionsConfig) {
			throw new Error(
				'No config found in local-config.ts. Please fill it with the proper configuration. local-config-example.ts file is used instead',
			);
		}
	} catch (e) {
		reactionsConfig = require('../../local-config-example')['default'];
	}

	return reactionsConfig;
};
