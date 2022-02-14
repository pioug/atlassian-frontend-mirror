import ensureTokenUsage from './rules/ensure-design-token-usage';
import noDeprecatedAPIs from './rules/no-deprecated-apis';
import noDeprecatedUsage from './rules/no-deprecated-design-token-usage';
import noDeprecatedImports from './rules/no-deprecated-imports';
import noUnsafeUsage from './rules/no-unsafe-design-token-usage';
import useVisuallyHidden from './rules/use-visually-hidden';

export const rules = {
  'ensure-design-token-usage': ensureTokenUsage,
  'no-unsafe-design-token-usage': noUnsafeUsage,
  'no-deprecated-design-token-usage': noDeprecatedUsage,
  'no-deprecated-imports': noDeprecatedImports,
  'no-deprecated-apis': noDeprecatedAPIs,
  'use-visually-hidden': useVisuallyHidden,
};

export const configs = {
  recommended: {
    plugins: ['@atlaskit/design-system'],
    rules: {
      '@atlaskit/design-system/no-deprecated-imports': 'error',
      '@atlaskit/design-system/use-visually-hidden': 'error',
      '@atlaskit/design-system/no-deprecated-apis': 'warn',
    },
  },
};
