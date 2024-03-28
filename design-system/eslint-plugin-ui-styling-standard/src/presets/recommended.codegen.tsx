/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2e134e292f949b29bfd0b29d128e684a>>
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-ui-styling-standard codegen
 */
export default {
  plugins: [
    '@atlaskit/ui-styling-standard',
    '@atlaskit/design-system',
    '@compiled',
  ],
  rules: {
    '@atlaskit/ui-styling-standard/convert-props-syntax': 'error',
    '@atlaskit/ui-styling-standard/local-cx-xcss': 'warn',
    '@atlaskit/ui-styling-standard/no-classname-prop': 'warn',
    '@atlaskit/ui-styling-standard/no-container-queries': 'warn',
    '@atlaskit/ui-styling-standard/no-important-styles': 'warn',
    '@atlaskit/design-system/consistent-css-prop-usage': [
      'warn',
      { excludeReactComponents: true },
    ],
    '@atlaskit/design-system/no-css-tagged-template-expression': 'warn',
    '@atlaskit/design-system/no-keyframes-tagged-template-expression': 'warn',
    '@atlaskit/design-system/no-styled-tagged-template-expression': [
      'warn',
      {
        importSources: [
          '@compiled/react',
          '@atlaskit/css',
          '@emotion/core',
          '@emotion/react',
          '@emotion/styled',
        ],
      },
    ],
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
