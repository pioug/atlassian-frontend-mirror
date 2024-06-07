module.exports = {
	rules: {
		'import/no-default-export': ['warn'],
	},
	overrides: [
		{
			files: [
				'**/__tests__/**/*.{js,ts,tsx}',
				'examples/**/*.{js,ts,tsx}',
				'docs/**/*.{js,ts,tsx}',
				'src/i18n/**/*.{js,ts,tsx}',
			],
			rules: {
				'import/no-default-export': ['off'],
			},
		},
		{
			files: ['src/**/*.vr.{js,ts,tsx}'],
			rules: {
				'@atlassian/tangerine/import/no-parent-imports': ['off'],
			},
		},
	],
};
