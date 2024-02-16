module.exports = {
  rules: {
    '@typescript-eslint/no-duplicate-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@atlaskit/design-system/consistent-css-prop-usage': 'warn',
    '@repo/internal/dom-events/no-unsafe-event-listeners': 'warn',
    '@atlaskit/design-system/ensure-design-token-usage/preview': [
      'error',
      { domains: ['spacing'], shouldEnforceFallbacks: false },
    ],
  },
};
