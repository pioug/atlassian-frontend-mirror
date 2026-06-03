import type { Rule } from 'eslint';
import { isAPIimport } from '../utils';

const rule: Rule.RuleModule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Warn against UNSAFE_noExposureExp usage',
			url: 'https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/master/platform/packages/platform/eslint-plugin/src/rules/feature-gating/no-unsafe-no-exposure/README.md',
		},
		messages: {
			unsafeUsage:
				"Manual firing of exposure is highly discouraged. Before considering using 'UNSAFE_noExposureExp' please refer to the Statsig playbook for valid usages - https://hello.atlassian.net/wiki/spaces/JFP/pages/3382881038/Jira+Playbook+Statsig",
		},
	},
	create(context) {
		return {
			'CallExpression[callee.type="Identifier"][callee.name="UNSAFE_noExposureExp"]': (
				node: any,
			) => {
				if (isAPIimport(node.callee.name, context, node)) {
					context.report({
						messageId: 'unsafeUsage',
						node,
					});
				}
			},
		};
	},
};

export default rule;
