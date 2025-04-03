import type { Rule } from 'eslint';
import { ImportDeclaration, isNodeOfType, JSXExpressionContainer } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const rule = createLintRule({
	meta: {
		name: 'use-cx-function-in-xcss',
		fixable: 'code',
		hasSuggestions: true,
		type: 'problem',
		docs: {
			description: 'Enforces cx function use to combine styles in xcss.',
			recommended: true,
			severity: 'error',
		},
		messages: {
			useCxFunc: `Use the cx function when combining styles in the xcss prop.`,
		},
	},
	create(context: Rule.RuleContext) {
		let importStatement: { node: ImportDeclaration; cxFuncLocalName?: string } | null = null;
		const primitiveNames: Set<string> = new Set();
		return {
			"ImportDeclaration[source.value='@atlaskit/css']"(node: ImportDeclaration) {
				importStatement = {
					node,
				};
				for (const specifier of node.specifiers) {
					if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'cx') {
						importStatement.cxFuncLocalName = specifier.local.name;
					}
				}
			},
			'ImportDeclaration[source.value="@atlaskit/primitives/compiled"]'(node: ImportDeclaration) {
				for (const specifier of node.specifiers) {
					primitiveNames.add(specifier.local.name);
				}
			},

			'JSXAttribute > JSXIdentifier[name=/[xX]css$/]'(node: Rule.Node) {
				const xcssValue: JSXExpressionContainer | undefined =
					node.parent &&
					isNodeOfType(node.parent, 'JSXAttribute') &&
					node.parent.value &&
					isNodeOfType(node.parent.value, 'JSXExpressionContainer')
						? node.parent.value
						: undefined;

				if (!xcssValue) {
					return;
				}
				const jsxElementName: string | undefined =
					node.parent.parent &&
					isNodeOfType(node.parent.parent, 'JSXOpeningElement') &&
					node.parent.parent.name &&
					isNodeOfType(node.parent.parent.name, 'JSXIdentifier')
						? node.parent.parent.name.name
						: undefined;
				if (!jsxElementName) {
					return;
				}
				// check if this JSX element is from the primitives entry point and if prop value is an array
				if (primitiveNames.has(jsxElementName) && xcssValue.expression.type === 'ArrayExpression') {
					context.report({
						node: xcssValue,
						messageId: 'useCxFunc',
						fix: (fixer) => {
							const fixes = [];
							const sourceCode = context.sourceCode;
							const styles = sourceCode.getText(xcssValue.expression);
							fixes.push(
								fixer.replaceText(
									xcssValue,
									(importStatement && importStatement.cxFuncLocalName
										? `{${importStatement.cxFuncLocalName}`
										: `{cx`) + `(${styles.replace(/^\[/, '').replace(/\]$/, '')})}`,
								),
							);
							if (!importStatement) {
								fixes.push(
									fixer.insertTextBeforeRange([0, 0], `import { cx } from '@atlaskit/css';\n`),
								);
							} else if (!importStatement.cxFuncLocalName) {
								const importText = sourceCode.getText(importStatement.node);
								fixes.push(
									fixer.replaceText(
										importStatement.node,
										importText.includes('{')
											? importText.replace(/import(.*) {\s?/, `import$1 { cx, `)
											: importText.replace(/ from /, `, { cx } from `),
									),
								);
							}
							return fixes;
						},
					});
				}
			},
		};
	},
});

export default rule;
