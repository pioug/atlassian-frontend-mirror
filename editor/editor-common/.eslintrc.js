module.exports = {
  rules: {
    'react/no-danger': 'error',
    '@typescript-eslint/consistent-type-imports': 'warn',
    'no-duplicate-imports': 'off',
    '@typescript-eslint/no-duplicate-imports': 'warn',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.{js,ts,tsx}', 'examples/**/*.{js,ts,tsx}'],
      rules: {
        'react/no-danger': 'off',
      },
    },
  ],
};
