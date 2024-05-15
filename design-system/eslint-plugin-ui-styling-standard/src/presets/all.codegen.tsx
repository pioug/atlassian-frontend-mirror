/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9ac05c3cbd30f6209164b7a24f7a7a19>>
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-ui-styling-standard codegen
 */
export default {
    plugins: ['@atlaskit/ui-styling-standard', '@atlaskit/design-system', '@compiled'],
    rules: {
        '@atlaskit/ui-styling-standard/atlaskit-theme': 'error',
        '@atlaskit/ui-styling-standard/convert-props-syntax': 'error',
        '@atlaskit/ui-styling-standard/enforce-style-prop': 'warn',
        '@atlaskit/ui-styling-standard/local-cx-xcss': 'warn',
        '@atlaskit/ui-styling-standard/no-array-arguments': 'warn',
        '@atlaskit/ui-styling-standard/no-classname-prop': 'warn',
        '@atlaskit/ui-styling-standard/no-container-queries': 'warn',
        '@atlaskit/ui-styling-standard/no-dynamic-styles': 'warn',
        '@atlaskit/ui-styling-standard/no-exported-styles': 'warn',
        '@atlaskit/ui-styling-standard/no-global-styles': 'warn',
        '@atlaskit/ui-styling-standard/no-important-styles': 'warn',
        '@atlaskit/ui-styling-standard/no-imported-style-values': 'warn',
        '@atlaskit/ui-styling-standard/no-nested-selectors': 'warn',
        '@atlaskit/ui-styling-standard/no-unsafe-values': 'warn',
        '@atlaskit/ui-styling-standard/use-compiled': 'warn',
        '@atlaskit/design-system/consistent-css-prop-usage': [
            'warn',
            { excludeReactComponents: true },
        ],
        '@atlaskit/design-system/no-css-tagged-template-expression': 'warn',
        '@atlaskit/design-system/no-keyframes-tagged-template-expression': 'warn',
        '@atlaskit/design-system/no-styled-tagged-template-expression': 'warn',
        '@compiled/no-suppress-xcss': 'warn',
        '@compiled/no-js-xcss': 'warn',
        '@atlaskit/design-system/no-empty-styled-expression': [
            'warn',
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
        '@atlaskit/design-system/no-exported-css': [
            'warn',
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
        '@atlaskit/design-system/no-exported-keyframes': [
            'warn',
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
            'warn',
            { allowedFunctionCalls: [['@atlaskit/tokens', 'token']] },
        ],
    },
};
