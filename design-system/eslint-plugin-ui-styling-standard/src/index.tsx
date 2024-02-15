export const rules = {};

export const configs = {
  recommended: {
    plugins: [
      '@atlaskit/ui-styling-standard',
      '@atlaskit/design-system',
      '@compiled',
    ],
    rules: {
      '@atlaskit/design-system/consistent-css-prop-usage': 'error',
      '@atlaskit/design-system/local-cx-xcss': 'error',
      '@compiled/no-suppress-xcss': 'error',
      '@compiled/no-js-xcss': 'error',
    },
  },
};
