// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import type { Node, Expression } from 'estree';

const FF_GETTER_BOOLEAN_IDENTIFIER = 'getBooleanFF' as const;

const __isOnlyOneFlagCheckInExpression = (root: Node | Expression, ignoredNode: Node): boolean => {
	switch (root.type) {
		case 'IfStatement':
			return __isOnlyOneFlagCheckInExpression(root.test, ignoredNode);
		case 'UnaryExpression':
			return __isOnlyOneFlagCheckInExpression(root.argument, ignoredNode);

		case 'CallExpression':
			if (root === ignoredNode) {
				return true;
			}
			return !(
				root.callee.type === 'Identifier' && root.callee.name === FF_GETTER_BOOLEAN_IDENTIFIER
			);

		// shouldn't ever get here but just in case
		case 'Identifier':
			return root.name !== FF_GETTER_BOOLEAN_IDENTIFIER;

		case 'BinaryExpression':
		case 'LogicalExpression':
			return (
				__isOnlyOneFlagCheckInExpression(root.left, ignoredNode) &&
				__isOnlyOneFlagCheckInExpression(root.right, ignoredNode)
			);

		default:
			return true;
	}
};

const isOnlyOneFlagCheckInExpression = (node: Rule.Node): boolean => {
	let root = node.parent;
	// find the root node of the expression
	// NOTE: This is not an exhaustive check for all ESTree.Expression types but is good enough
	while (root.type.endsWith('Expression')) {
		root = root.parent;
	}

	return __isOnlyOneFlagCheckInExpression(root, node);
};

const rule: Rule.RuleModule = {
	meta: {
		hasSuggestions: false,
		docs: {
			recommended: false,
		},
		type: 'problem',
		messages: {
			onlyInlineIf:
				'Use the feature-flag call directly in the consuming conditional expression instead of assigning its result to a variable. Keep the check inside a function; see platform/packages/platform/eslint-plugin/src/rules/no-invalid-feature-flag-usage/README.md.',
			onlyStringLiteral:
				'Pass the flag name as a static string literal directly to getBooleanFF, rather than a variable or computed expression, so flag analysis can identify it.',
			multipleFlagCheckInExpression:
				'Keep one feature-flag check per conditional expression. Split independent conditions into nested branches, preserving short-circuit behavior; see platform/packages/platform/eslint-plugin/src/rules/no-invalid-feature-flag-usage/README.md.',
			noModuleScope:
				'Move this feature-flag-dependent computation into the function or component that consumes it. Export the function or component rather than a result computed while the module loads.',
		},
	},
	create(context) {
		return {
			[`CallExpression[callee.name=/${FF_GETTER_BOOLEAN_IDENTIFIER}/]`]: (node: Rule.Node) => {
				// to make typescript happy
				if (node.type === 'CallExpression') {
					const args = node.arguments;

					if (args.length === 1 && args[0].type !== 'Literal') {
						return context.report({
							node,
							messageId: 'onlyStringLiteral',
						});
					}

					switch (node.parent?.type) {
						case 'IfStatement':
							break;
						case 'ConditionalExpression':
							switch (node.parent?.parent.type) {
								case 'ExportDefaultDeclaration':
									// handles "export default getBooleanFF('test-flag') ? "this is" : "not good";"
									context.report({
										node,
										messageId: 'noModuleScope',
									});
									break;
								case 'VariableDeclarator':
									// handles "export const foo = getBooleanFF('test-flag') ? 'this is' : 'not good';"
									if (
										node.parent.parent.parent.type === 'VariableDeclaration' &&
										node.parent.parent.parent.parent.type === 'ExportNamedDeclaration'
									) {
										context.report({
											node,
											messageId: 'noModuleScope',
										});
									}
									break;
							}
							break;
						case 'UnaryExpression':
						case 'LogicalExpression':
							if (!isOnlyOneFlagCheckInExpression(node)) {
								context.report({
									node,
									messageId: 'multipleFlagCheckInExpression',
								});
							}
							break;
						default:
							return context.report({
								node,
								messageId: 'onlyInlineIf',
							});
					}
				}

				return {};
			},
		};
	},
};

export default rule;
