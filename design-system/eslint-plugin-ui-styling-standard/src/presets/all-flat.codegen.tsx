/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f99588f71d6b353cefbed97fd172e433>>
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-ui-styling-standard codegen
 */
import type { Linter } from 'eslint';

import * as atlaskitDesignSystemPlugin from '@atlaskit/eslint-plugin-design-system';

const config: Linter.FlatConfig = {
	plugins: {
		// NOTE: The reference to this plugin is inserted dynamically while creating the plugin in `index.codegen.tsx`
		'@atlaskit/design-system': atlaskitDesignSystemPlugin,
	},
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
		'@atlaskit/ui-styling-standard/no-unused-cssmap-properties': 'warn',
		'@atlaskit/ui-styling-standard/use-compiled': 'error',
		'@atlaskit/design-system/consistent-css-prop-usage': [
			'error',
			{
				excludeReactComponents: true,
				shouldAlwaysCheckXcss: true,
			},
		],
		'@atlaskit/design-system/no-css-tagged-template-expression': 'error',
		'@atlaskit/design-system/no-keyframes-tagged-template-expression': 'error',
		'@atlaskit/design-system/no-styled-tagged-template-expression': 'error',
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
			{
				allowedFunctionCalls: [['@atlaskit/tokens', 'token']],
			},
		],
	},
};

export default config;
