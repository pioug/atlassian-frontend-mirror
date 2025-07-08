import ensureDesignTokenUsage from './rules/ensure-design-token-usage';
import noDeprecatedDesignTokenUsage from './rules/no-deprecated-design-token-usage';
import noUnsafeDesignTokenUsage from './rules/no-unsafe-design-token-usage';

const rules = [ensureDesignTokenUsage, noDeprecatedDesignTokenUsage, noUnsafeDesignTokenUsage];

// This is necessary due to the way stylelint changes imports in esm-land
// https://github.com/stylelint/stylelint/issues/8573#issuecomment-2982939797
module.exports = rules;
