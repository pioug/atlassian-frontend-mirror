import ensureTokenUsage from './rules/ensure-design-token-usage';
import ensureTokenUsageSpacing from './rules/ensure-design-token-usage-spacing';
import iconLabel from './rules/icon-label';
import noBannedImports from './rules/no-banned-imports';
import noDeprecatedAPIs from './rules/no-deprecated-apis';
import noDeprecatedUsage from './rules/no-deprecated-design-token-usage';
import noDeprecatedImports from './rules/no-deprecated-imports';
import noUnsafeUsage from './rules/no-unsafe-design-token-usage';
import usePrimitives from './rules/use-primitives';
import useVisuallyHidden from './rules/use-visually-hidden';

export const rules = {
  'ensure-design-token-usage': ensureTokenUsage,
  'icon-label': iconLabel,
  'no-deprecated-apis': noDeprecatedAPIs,
  'no-deprecated-design-token-usage': noDeprecatedUsage,
  'no-deprecated-imports': noDeprecatedImports,
  'no-banned-imports': noBannedImports,
  'no-unsafe-design-token-usage': noUnsafeUsage,
  'use-visually-hidden': useVisuallyHidden,
  'ensure-design-token-usage-spacing': ensureTokenUsageSpacing,
  'use-primitives': usePrimitives,
};

export const configs = {
  recommended: {
    plugins: ['@atlaskit/design-system'],
    rules: {
      '@atlaskit/design-system/icon-label': 'warn',
      '@atlaskit/design-system/no-deprecated-apis': 'warn',
      '@atlaskit/design-system/no-deprecated-imports': 'error',
      '@atlaskit/design-system/use-visually-hidden': 'error',
      '@atlaskit/design-system/no-banned-imports': 'error',
    },
  },
  all: {
    plugins: ['@atlaskit/design-system'],
    rules: {
      '@atlaskit/design-system/icon-label': 'error',
      '@atlaskit/design-system/no-deprecated-apis': 'error',
      '@atlaskit/design-system/no-deprecated-imports': 'error',
      '@atlaskit/design-system/use-visually-hidden': 'error',
      '@atlaskit/design-system/ensure-design-token-usage': 'error',
      '@atlaskit/design-system/no-banned-imports': 'error',
      '@atlaskit/design-system/no-unsafe-design-token-usage': 'error',
      '@atlaskit/design-system/ensure-design-token-usage-spacing': 'error',
    },
  },
};

export { filterActionableDeprecations } from './rules/no-deprecated-apis/helpers/filter-actionable-deprecations';
