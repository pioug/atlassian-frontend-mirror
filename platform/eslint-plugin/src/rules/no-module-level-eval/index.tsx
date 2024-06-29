import type { Rule } from 'eslint';
import { isAPIimport, type Node } from '../utils';

const isInFunctionLevel = (context: Rule.RuleContext) => {
	let scope: any = context.getScope();

	while (scope?.type !== 'module' && scope?.type !== 'global') {
		if (scope.type === 'function') {
			return true;
		}

		if (scope.type === 'class-field-initializer') {
			return !scope.block.parent.static;
		}

		scope = scope.upper;
	}

	return false;
};

const rule: Rule.RuleModule = {
	meta: {
		docs: {
			description: 'Disallow feature flag usage at module level',
			url: 'https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/browse/platform/packages/platform/eslint-plugin/src/rules/ff/no-module-level-eval/README.md',
		},
		messages: {
			noModuleLevelEval:
				'Do not evaluate feature flags at module level, it will always resolve to false when server side rendered.',
		},
	},
	create(context) {
		return {
			'CallExpression[callee.type="Identifier"]': (node: Node<any>) => {
				if (
					node.type === 'CallExpression' &&
					node.callee.type === 'Identifier' &&
					isAPIimport(node.callee.name, context) &&
					!isInFunctionLevel(context)
				) {
					context.report({
						messageId: 'noModuleLevelEval',
						node,
					});
				}
			},
		};
	},
};

export default rule;
