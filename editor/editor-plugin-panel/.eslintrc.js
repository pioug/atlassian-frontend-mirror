module.exports = {
  rules: {
    '@typescript-eslint/no-duplicate-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          'React.FC':
            'Please use types directly on props instead, and explicitly define children if required',
          'React.FunctionalComponent':
            'Please use types directly on props instead, and explicitly define children if required',
        },
        extendDefaults: false,
      },
    ],
  },
};
