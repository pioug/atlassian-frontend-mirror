import type { Rule } from 'eslint';
import type { Node } from 'estree';
import { getScope } from '../../util/context-compat';

const featureLibraryFunctions = new Set([
	/*
	 * STOP!
	 *
	 * Your code should call the API functions directly!
	 * But, we are temporarily adding these methods to prevent SSR builds from breaking
	 * while we work out a solution for the features to be evaluated inline.
	 * Do not add anything here without the permission of #help-jfp-squads
	 *
	 * Slack thread: https://atlassian.slack.com/archives/CFGLH1ZS8/p1726449739284819
	 */
	'isVisualRefreshEnabled',
	'getMetaBoolean',
	'getNav4Rollout',
	'getWillShowNav3',
	'getWillShowNav4',
	'getWillShowNav4UserOptIn',
	'getWillShowNav4UserOptOut',
]);

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
			description: 'Disallow getWillShowNav4 or isVisualRefreshEnabled usage at module level',
			url: 'https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/master/platform/packages/platform/eslint-plugin/src/rules/no-module-level-eval-nav4/README.md',
		},
		messages: {
			noModuleLevelEval:
				'Do not evaluate getWillShowNav4 or isVisualRefreshEnabled at module level. This causes complications with SSR. If feature flagging components in `jira` use `componentWithCondition` from `@atlassian/jira-feature-flagging-utils`.',
		},
	},
	create(context) {
		return {
			'CallExpression[callee.type="Identifier"]': (node: Node) => {
				if (
					node.type === 'CallExpression' &&
					node.callee.type === 'Identifier' &&
					featureLibraryFunctions.has(node.callee.name) &&
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
