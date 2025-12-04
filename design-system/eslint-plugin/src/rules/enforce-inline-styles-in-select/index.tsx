import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

import { checkStylesObject } from './utils';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'enforce-inline-styles-in-select',
		docs: {
			description:
				'Disallow unsupported CSS selectors in styles prop for @atlaskit/select and require inline styles only',
			recommended: false,
			severity: 'error',
		},
		messages: {
			noPseudoClass:
				"This selector '{{pseudo}}' is not allowed in styles for @atlaskit/select. Please use the `components` API in select with `xcss` props.",
			noVariableStyles:
				'Variable-defined styles are not allowed for @atlaskit/select. Please use inline styles object or the `components` API with `xcss` props.',
		},
	},

	create(context) {
		// Track imports of @atlaskit/select
		const atlaskitSelectImports = new Set();

		return {
			ImportDeclaration(node) {
				if (node.source.value !== '@atlaskit/select') {
					return;
				}
				node.specifiers.forEach((spec) => {
					if (isNodeOfType(spec, 'ImportDefaultSpecifier')) {
						atlaskitSelectImports.add(spec.local.name);
					}
				});
			},

			// @ts-ignore - Node type compatibility issue with EslintNode
			JSXElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}

				// Check if this is a Select component from @atlaskit/select
				if (
					isNodeOfType(node.openingElement.name, 'JSXIdentifier') &&
					atlaskitSelectImports.has(node.openingElement.name.name)
				) {
					// Look for styles prop
					const stylesAttr = node.openingElement.attributes.find(
						(attr) =>
							isNodeOfType(attr, 'JSXAttribute') &&
							isNodeOfType(attr.name, 'JSXIdentifier') &&
							attr.name.name === 'styles',
					);

					if (stylesAttr && isNodeOfType(stylesAttr, 'JSXAttribute') && stylesAttr.value) {
						if (isNodeOfType(stylesAttr.value, 'JSXExpressionContainer')) {
							const expression = stylesAttr.value.expression;

							// Check if it's an inline object expression
							if (isNodeOfType(expression, 'ObjectExpression')) {
								// This is an inline styles object - check for unsupported selectors
								checkStylesObject(node, expression, context);
							} else if (isNodeOfType(expression, 'Identifier')) {
								// This is a variable reference - not allowed
								context.report({
									node: expression,
									messageId: 'noVariableStyles',
								});
							} else {
								// Any other expression type (function calls, member expressions, etc.) - not allowed
								context.report({
									node: expression,
									messageId: 'noVariableStyles',
								});
							}
						}
					}
				}
			},
		};
	},
});

export default rule;
