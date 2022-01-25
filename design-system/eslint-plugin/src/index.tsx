import ensureTokenUsage from './rules/ensure-design-token-usage';
import noDeprecatedUsage from './rules/no-deprecated-design-token-usage';
import noDeprecatedImports from './rules/no-deprecated-imports';
import noUnsafeUsage from './rules/no-unsafe-design-token-usage';

export const rules = {
  'ensure-design-token-usage': ensureTokenUsage,
  'no-unsafe-design-token-usage': noUnsafeUsage,
  'no-deprecated-design-token-usage': noDeprecatedUsage,
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
