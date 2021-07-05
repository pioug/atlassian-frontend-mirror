import ensureTokenUsage from './rules/ensure-design-token-usage';

export const rules = {
  'ensure-design-token-usage': ensureTokenUsage,
};

export const configs = {
  plugins: ['@atlaskit/design-system'],
  recommended: {
    rules: {},
  },
};
