import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
	meta: {
		docs: {
			description:
				"Prevent usage of setImmediate in favor of React Testing Library's `waitFor` or similar",
			recommended: true,
		},
		type: 'problem',
		messages: {
			noSetImmediate:
				"Avoid using setImmediate. Use React Testing Library's waitFor or similar instead for better test reliability.",
			suggestWaitFor: 'Replace with waitFor from @testing-library/react or similar',
		},
		hasSuggestions: true,
	},
	create(context) {
		return {
			CallExpression(node) {
				if (node.callee.type === 'Identifier' && node.callee.name === 'setImmediate') {
					context.report({
						node,
						messageId: 'noSetImmediate',
						suggest: [
							{
								messageId: 'suggestWaitFor',
								fix(fixer) {
									return fixer.replaceText(
										node,
										'await waitFor(() => { /* your assertion here */ })',
									);
								},
							},
						],
					});
				}
			},
		};
	},
};

export default rule;
