import { createWithConfig } from '../ensure-design-token-usage';
import ruleMeta from '../ensure-design-token-usage/rule-meta';
import { RuleConfig } from '../ensure-design-token-usage/types';
import { createLintRule } from '../utils/create-rule';

const defaultConfig: RuleConfig = {
  domains: ['spacing'],
  applyImport: true,
  shouldEnforceFallbacks: false,
};

// TODO: Delete this file after merging. This exists only to ensure existing eslint-disable comments for the spacing rule do not error
const rule = createLintRule({
  meta: {
    ...ruleMeta,
    name: 'ensure-design-token-usage-spacing',
    docs: {
      ...ruleMeta.docs,
      description:
        'NOTE: This rule is deprecated and will be removed imminently. Use `ensure-design-token-usage` instead.',
      recommended: false,
      severity: 'warn',
    },
  },
  create: createWithConfig(defaultConfig),
});

export default rule;
