import ensureTokenUsage from './rules/ensure-design-token-usage';
import noDeprecatedImports from './rules/no-deprecated-imports';

export const rules = {
  'ensure-design-token-usage': ensureTokenUsage,
  'no-deprecated-imports': noDeprecatedImports,
};

export const configs = {
  recommended: {
    plugins: ['@atlaskit/design-system'],
    rules: {
      '@atlaskit/design-system/no-deprecated-imports': 'error',
    },
  },
};
