module.exports = {
	rules: {
		'@typescript-eslint/no-explicit-any': 'error',
		'@atlaskit/design-system/ensure-design-token-usage/preview': [
			'error',
			{ domains: ['spacing'], shouldEnforceFallbacks: false },
		],
		'import/no-restricted-paths': [
			'warn',
			{
				zones: [
					{
						target: 'packages/editor/editor-core/src/**/*',
						from: `packages/editor/editor-core/src/plugins/*/!(types)*`,
						message:
							'[ELR101] Avoid importing dependencies from editor plugins. Type-only imports are an exception. Move shared code to a common location. go/elr101',
					},
					{
						target: 'packages/editor/editor-core/src/**/*',
						from: `packages/editor/editor-core/src/plugins/*/!(types)**/*`,
						message:
							'[ELR101] Avoid importing dependencies from editor plugins. Type-only imports are an exception. Move shared code to a common location. go/elr101',
					},
				],
			},
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
				'import/no-restricted-paths': ['off'],
				'@typescript-eslint/no-explicit-any': ['off'],
			},
		},
	],
};
