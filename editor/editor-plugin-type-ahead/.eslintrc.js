module.exports = {
	rules: {
		'@typescript-eslint/no-duplicate-imports': 'error',
		'@typescript-eslint/no-explicit-any': 'error',
		'@atlaskit/design-system/ensure-design-token-usage/preview': [
			'error',
			{ domains: ['spacing'], shouldEnforceFallbacks: false },
		],
	},
};
