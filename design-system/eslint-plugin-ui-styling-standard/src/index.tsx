export const rules = {};

const importSources: readonly string[] = [
  '@compiled/react',
  '@atlaskit/css',
  '@emotion/core',
  '@emotion/styled',
  'styled-components',
];

export const configs = {
  recommended: {
    plugins: [
      '@atlaskit/ui-styling-standard',
      '@atlaskit/design-system',
      '@compiled',
    ],
    rules: {
      '@atlaskit/design-system/consistent-css-prop-usage': [
        'warn',
        {
          // When passing a css prop to a React component, we don't know whether the component
          // is Emotion or Compiled. Hence it is not safe to run autofixes like wrapping it in
          // a `css` function call.
          excludeReactComponents: true,
        },
      ],
      '@atlaskit/design-system/local-cx-xcss': 'warn',
      '@atlaskit/design-system/no-css-tagged-template-expression': 'warn',
      '@atlaskit/design-system/no-keyframes-tagged-template-expression': 'warn',
      '@atlaskit/design-system/no-styled-tagged-template-expression': 'warn',
      '@compiled/no-suppress-xcss': 'error',
      '@compiled/no-js-xcss': 'error',
      '@atlaskit/design-system/no-empty-styled-expression': [
        'warn',
        { importSources },
      ],
      '@atlaskit/design-system/no-exported-css': ['warn', { importSources }],
      '@atlaskit/design-system/no-exported-keyframes': [
        'warn',
        { importSources },
      ],
      '@atlaskit/design-system/no-invalid-css-map': [
        'warn',
        {
          allowedFunctionCalls: [['@atlaskit/tokens', 'token']],
        },
      ],
    },
  },
};
