module.exports = {
	rules: {
		'@typescript-eslint/no-explicit-any': 'error',
		'@atlaskit/design-system/ensure-design-token-usage/preview': [
			'error',
			{ domains: ['spacing'], shouldEnforceFallbacks: false },
		],
	},
	overrides: [
		{
			files: [
				'**/__tests__/**/*.{js,ts,tsx}',
				'examples/**/*.{js,ts,tsx}',
				'**/*.{test,spec}.{js,ts,tsx}',
			],
			rules: {
				'@typescript-eslint/no-explicit-any': ['off'],
			},
		},
	],
};
