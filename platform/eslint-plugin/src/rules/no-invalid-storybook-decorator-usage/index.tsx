// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';

const STORYBOOK_DECORATOR_IDENTIFIER = 'withPlatformFeatureGates' as const;

const rule: Rule.RuleModule = {
	meta: {
		hasSuggestions: false,
		docs: {
			recommended: false,
		},
		type: 'problem',
		messages: {
			onlyObjectExpression:
				'Only object literals allowed in the storybook decorator! See http://go/pff-eslint for more details',
		},
	},
	create(context) {
		return {
			[`CallExpression[callee.name=/${STORYBOOK_DECORATOR_IDENTIFIER}/]`]: (node: Rule.Node) => {
				// to make typescript happy
				if (node.type === 'CallExpression') {
					const args = node.arguments;

					if (args.length === 1 && args[0].type !== 'ObjectExpression') {
						return context.report({
							node,
							messageId: 'onlyObjectExpression',
						});
					}
				}

				return {};
			},
		};
	},
};

export default rule;
