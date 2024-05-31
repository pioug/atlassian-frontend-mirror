module.exports = {
	rules: {
		'no-duplicate-imports': 'off',
		'@typescript-eslint/no-duplicate-imports': 'error',
		'@typescript-eslint/no-explicit-any': 'error',
	},
	overrides: [
		{
			files: ['**/__tests__/**/*.{js,ts,tsx}', '**/examples/**/*.{js,ts,tsx}'],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
			},
		},
	],
};
