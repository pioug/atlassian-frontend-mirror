import ensureTokenUsage from './rules/ensure-design-token-usage';

export const rules = {
  'ensure-design-token-usage': ensureTokenUsage,
};

export const configs = {
  recommended: {
    rules: {
      '@atlaskit/design-system-eslint-plugin/ensure-design-token-usage':
        'error',
    },
  },
};
