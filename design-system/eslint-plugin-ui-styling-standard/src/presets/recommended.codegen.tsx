/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::330ecd53e03bf78708580ddcfb206876>>
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-ui-styling-standard codegen
 */
export default {
	plugins: ['@atlaskit/ui-styling-standard', '@atlaskit/design-system', '@compiled'],
	rules: {
		'@atlaskit/ui-styling-standard/atlaskit-theme': 'error',
		'@atlaskit/ui-styling-standard/convert-props-syntax': 'error',
		'@atlaskit/ui-styling-standard/enforce-style-prop': 'error',
		'@atlaskit/ui-styling-standard/local-cx-xcss': 'error',
		'@atlaskit/ui-styling-standard/no-array-arguments': 'error',
		'@atlaskit/ui-styling-standard/no-classname-prop': 'error',
		'@atlaskit/ui-styling-standard/no-container-queries': 'error',
		'@atlaskit/ui-styling-standard/no-dynamic-styles': 'error',
		'@atlaskit/ui-styling-standard/no-exported-styles': 'error',
		'@atlaskit/ui-styling-standard/no-global-styles': 'error',
		'@atlaskit/ui-styling-standard/no-important-styles': 'error',
		'@atlaskit/ui-styling-standard/no-imported-style-values': 'error',
		'@atlaskit/ui-styling-standard/no-nested-selectors': 'error',
		'@atlaskit/ui-styling-standard/no-styled': 'error',
		'@atlaskit/ui-styling-standard/no-unsafe-selectors': 'error',
		'@atlaskit/ui-styling-standard/no-unsafe-values': 'error',
		'@atlaskit/ui-styling-standard/use-compiled': 'error',
		'@atlaskit/design-system/consistent-css-prop-usage': [
			'error',
			{ excludeReactComponents: true, shouldAlwaysCheckXcss: true },
		],
		'@atlaskit/design-system/no-css-tagged-template-expression': 'error',
		'@atlaskit/design-system/no-keyframes-tagged-template-expression': 'error',
		'@atlaskit/design-system/no-styled-tagged-template-expression': 'error',
		'@compiled/no-suppress-xcss': 'error',
		'@compiled/no-js-xcss': 'error',
		'@atlaskit/design-system/no-empty-styled-expression': [
			'error',
			{
				importSources: [
					'@compiled/react',
					'@atlaskit/css',
					'@emotion/core',
					'@emotion/react',
					'@emotion/styled',
					'styled-components',
				],
			},
		],
		'@atlaskit/design-system/no-invalid-css-map': [
			'error',
			{ allowedFunctionCalls: [['@atlaskit/tokens', 'token']] },
		],
	},
};
