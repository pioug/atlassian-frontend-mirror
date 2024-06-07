import ruleMeta from '../ensure-design-token-usage/rule-meta';
import { createLintRule } from '../utils/create-rule';

const rule = createLintRule({
	meta: {
		...ruleMeta,
		name: 'ensure-design-token-usage/preview',
		deprecated: true,
		replacedBy: ['@atlaskit/design-system/use-tokens-space'],
		docs: {
			...ruleMeta.docs,
			description: 'Enforces usage of pre-release design tokens rather than hard-coded values.',
			recommended: false,
			severity: 'warn',
		},
	},
	create() {
		/**
		 * We can't just outright delete the ESLint rule, since:
		 * ```
		 * // eslint-disable @eslint-plugin/design-system/ensure-design-token-usage/preview
		 * ```
		 * will cause CI to fail if the rule definition doesn't exist. So, instead
		 * we can change the implementation of the rule so that it never reports.
		 */
		return {};
	},
});

export default rule;
