import ensureTokenUsage from './rules/ensure-design-token-usage';
import iconLabel from './rules/icon-label';
import noDeprecatedAPIs from './rules/no-deprecated-apis';
import noDeprecatedUsage from './rules/no-deprecated-design-token-usage';
import noDeprecatedImports from './rules/no-deprecated-imports';
import noUnsafeUsage from './rules/no-unsafe-design-token-usage';
import useVisuallyHidden from './rules/use-visually-hidden';

export const rules = {
  'ensure-design-token-usage': ensureTokenUsage,
  'icon-label': iconLabel,
  'no-deprecated-apis': noDeprecatedAPIs,
  'no-deprecated-design-token-usage': noDeprecatedUsage,
  'no-deprecated-imports': noDeprecatedImports,
  'no-unsafe-design-token-usage': noUnsafeUsage,
  'use-visually-hidden': useVisuallyHidden,
};

export const configs = {
  recommended: {
    plugins: ['@atlaskit/design-system'],
    rules: {
      '@atlaskit/design-system/icon-label': 'warn',
      '@atlaskit/design-system/no-deprecated-apis': 'warn',
      '@atlaskit/design-system/no-deprecated-imports': 'error',
      '@atlaskit/design-system/use-visually-hidden': 'error',
    },
  },
};
