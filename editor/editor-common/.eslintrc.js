module.exports = {
  rules: {
    '@atlaskit/design-system/ensure-design-token-usage/preview': [
      'error',
      { domains: ['spacing'], shouldEnforceFallbacks: false },
    ],
  },
};
