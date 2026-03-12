import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Prevent barrel imports from @atlassian/conversation-assistant packages',
			category: 'Best Practices',
			recommended: false,
		},
		messages: {
			barrelImport:
				"Do not import from the barrel file '{{source}}'. Import from a specific package.json 'exports' entry instead (add new one if needed), e.g., '@atlassian/conversation-assistant/hooks'. This will result in faster IDE type highlight, faster dev server startup, and fewer CI tests run.",
		},
	},
	create(context) {
		return {
			ImportDeclaration(node: Rule.Node) {
				if (node.type !== 'ImportDeclaration') {
					return;
				}

				const source = String(node.source.value);

				// Check if it matches @atlassian/conversation-assistant or @atlassian/conversation-assistant-* (without subpath)
				// Regex: starts with @atlassian/conversation-assistant, optionally followed by -<suffix>, but NOT followed by /
				const barrelImportRegex = /^@atlassian\/conversation-assistant(-[^/]+)?$/;

				if (barrelImportRegex.test(source)) {
					context.report({
						node: node.source,
						messageId: 'barrelImport',
						data: {
							source,
						},
					});
				}
			},
		};
	},
};

export default rule;
