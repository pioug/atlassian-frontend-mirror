import { createWithConfig } from '../ensure-design-token-usage';
import ruleMeta from '../ensure-design-token-usage/rule-meta';
import { RuleConfig } from '../ensure-design-token-usage/types';
import { createLintRule } from '../utils/create-rule';

const defaultConfig: RuleConfig = {
  domains: ['spacing'],
  applyImport: true,
  shouldEnforceFallbacks: false,
};

const rule = createLintRule({
  meta: {
    ...ruleMeta,
    name: 'ensure-design-token-usage/preview',
    docs: {
      ...ruleMeta.docs,
      description:
        'Enforces usage of pre-release design tokens rather than hard-coded values.',
      recommended: false,
      severity: 'warn',
    },
  },
  create: createWithConfig(defaultConfig),
});

export default rule;
