module.exports = {
  rules: {
    'react/no-danger': 'error',
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
