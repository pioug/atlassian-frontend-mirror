import type { Rule } from 'eslint';
import type { Node } from 'estree';
import { isAPIimport } from '../utils';
import { getScope } from '../../util/context-compat';

const isInFunctionLevel = (context: Rule.RuleContext, node: Node) => {
	let scope: any = getScope(context, node);

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
			url: 'https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/master/platform/packages/platform/eslint-plugin/src/rules/no-module-level-eval/README.md',
		},
		messages: {
			noModuleLevelEval:
				'Do not evaluate feature flags in the module level, it will always resolve to false when server side rendered or when flags are loaded async.',
		},
	},
	create(context) {
		return {
			'CallExpression[callee.type="Identifier"]': (node: Node) => {
				if (
					node.type === 'CallExpression' &&
					node.callee.type === 'Identifier' &&
					isAPIimport(node.callee.name, context, node) &&
					!isInFunctionLevel(context, node)
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
