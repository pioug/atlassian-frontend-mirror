module.exports = {
  rules: {
    '@typescript-eslint/no-duplicate-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@atlaskit/design-system/ensure-design-token-usage/preview': [
      'error',
      { domains: ['spacing'], shouldEnforceFallbacks: false },
    ],
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
