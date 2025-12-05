import type { Rule } from 'eslint';
import {
	isNodeOfType,
	type JSXAttribute,
	type JSXSpreadAttribute,
	type VariableDeclarator,
} from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';
import { errorBoundary } from '../utils/error-boundary';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'ensure-proper-xcss-usage',
		docs: {
			description:
				'Enforces proper xcss usage: migrate from xcss() to cssMap() and use cssMap objects with specific keys.',
			recommended: false,
			severity: 'error',
		},
		messages: {
			missingCssMapKey:
				'xcss prop should use a specific key from cssMap (e.g., {{identifier}}.root) instead of the entire cssMap object.',
			noXcssWithCompiled:
				'Cannot use `xcss()` function with `@atlaskit/primitives/compiled`. Use `cssMap()` from `@atlaskit/css or `@compiled/react` instead.',
		},
	},

	create(context) {
		const tracker = {
			// Components tracking
			compiledComponents: new Set<string>(),

			// Function tracking
			cssMapFunction: new Set<string>(),
			xcssFunction: new Set<string>(),

			// Variables tracking
			cssMapVariables: new Map<string, Set<string>>(),
			xcssVariables: new Set<string>(),
		};

		// Store potential violations to check after all declarations are collected
		const potentialViolations: Array<{
			node: Rule.Node;
			identifierName: string;
			type: 'identifier' | 'memberExpression';
		}> = [];

		return errorBoundary({
			// Track all imports in a single handler
			ImportDeclaration(node) {
				const source = node.source.value;

				node.specifiers.forEach((specifier) => {
					if (specifier.type !== 'ImportSpecifier') {
						return;
					}

					// Handle different import sources
					switch (source) {
						case '@atlaskit/primitives/compiled':
							if (specifier.imported.type === 'Identifier') {
								// Track the local name (alias), not the imported name
								// e.g., import { Box as CompiledBox } -> track "CompiledBox"
								tracker.compiledComponents.add(specifier.local.name);
							}
							break;

						case '@atlaskit/primitives':
							if (specifier.imported.type === 'Identifier' && specifier.imported.name === 'xcss') {
								tracker.xcssFunction.add(specifier.local.name);
							}
							break;

						case '@atlaskit/css':
						case '@compiled/react':
							if (
								specifier.imported.type === 'Identifier' &&
								specifier.imported.name === 'cssMap'
							) {
								tracker.cssMapFunction.add(specifier.local.name);
							}
							break;
					}
				});
			},

			// Track variable declarations
			VariableDeclarator(node: VariableDeclarator) {
				if (
					!node.init ||
					node.init.type !== 'CallExpression' ||
					node.init.callee.type !== 'Identifier' ||
					node.id.type !== 'Identifier'
				) {
					return;
				}

				const calleeName = node.init.callee.name;
				const variableName = node.id.name;

				// Track cssMap variables and extract their keys
				if (tracker.cssMapFunction.has(calleeName)) {
					const keys = new Set<string>();

					// Extract keys from the cssMap object argument
					if (
						node.init.arguments.length > 0 &&
						node.init.arguments[0].type === 'ObjectExpression'
					) {
						node.init.arguments[0].properties.forEach((prop) => {
							if (prop.type === 'Property' && prop.key.type === 'Identifier') {
								keys.add(prop.key.name);
							}
						});
					}

					tracker.cssMapVariables.set(variableName, keys);

					// Check if this variable was used before it was declared
					const violationsToRemove: number[] = [];
					potentialViolations.forEach((violation, index) => {
						if (violation.identifierName === variableName) {
							if (violation.type === 'identifier') {
								// Identifier usage of cssMap variable is invalid (e.g., styles instead of styles.root)
								context.report({
									node: violation.node,
									messageId: 'missingCssMapKey',
									data: { identifier: variableName },
								});
								violationsToRemove.push(index);
							}
							// Member expressions with cssMap are valid (e.g., styles.root) - just remove from list
							// No need to report or keep in list
							if (violation.type === 'memberExpression') {
								violationsToRemove.push(index);
							}
						}
					});
					// Remove violations in reverse order to maintain indices
					violationsToRemove.reverse().forEach((index) => {
						potentialViolations.splice(index, 1);
					});
				}

				// Track xcss variables
				if (tracker.xcssFunction.has(calleeName)) {
					tracker.xcssVariables.add(variableName);

					// Check if this variable was used before it was declared
					const violationsToRemove: number[] = [];
					potentialViolations.forEach((violation, index) => {
						if (violation.identifierName === variableName) {
							context.report({
								node: violation.node,
								messageId: 'noXcssWithCompiled',
							});
							violationsToRemove.push(index);
						}
					});
					// Remove violations in reverse order to maintain indices
					violationsToRemove.reverse().forEach((index) => {
						potentialViolations.splice(index, 1);
					});
				}
			},

			// Check JSX elements for xcss prop usage
			JSXElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}

				const elementName = node.openingElement.name;
				if (elementName.type !== 'JSXIdentifier') {
					return;
				}

				const componentName = elementName.name;
				if (!tracker.compiledComponents.has(componentName)) {
					return;
				}

				// Find xcss attribute
				const xcssAttribute = node.openingElement.attributes.find(
					(attr: JSXAttribute | JSXSpreadAttribute) =>
						attr.type === 'JSXAttribute' && attr.name.name === 'xcss',
				) as JSXAttribute;

				if (xcssAttribute?.value?.type !== 'JSXExpressionContainer') {
					return;
				}

				const expression = xcssAttribute.value.expression;

				// Check for direct xcss function calls
				if (
					expression.type === 'CallExpression' &&
					expression.callee.type === 'Identifier' &&
					tracker.xcssFunction.has(expression.callee.name)
				) {
					context.report({
						node: expression,
						messageId: 'noXcssWithCompiled',
					});
					return;
				}

				// Check for variables
				if (expression.type === 'Identifier') {
					const identifierName = expression.name;

					if (tracker.xcssVariables.has(identifierName)) {
						context.report({
							node: expression as Rule.Node,
							messageId: 'noXcssWithCompiled',
						});
					} else if (tracker.cssMapVariables.has(identifierName)) {
						context.report({
							node: expression as Rule.Node,
							messageId: 'missingCssMapKey',
							data: { identifier: identifierName },
						});
					} else {
						// Variable not yet declared - store for later check
						potentialViolations.push({
							node: expression as Rule.Node,
							identifierName,
							type: 'identifier',
						});
					}
					return;
				}

				// Check member expressions (e.g., styles.root)
				if (expression.type === 'MemberExpression' && expression.object.type === 'Identifier') {
					const objectName = expression.object.name;

					if (tracker.xcssVariables.has(objectName)) {
						context.report({
							node: expression as Rule.Node,
							messageId: 'noXcssWithCompiled',
						});
					} else if (!tracker.cssMapVariables.has(objectName)) {
						// Variable not yet declared - store for later check
						// Note: If it's already a cssMap variable, member expressions are valid (e.g., styles.root)
						potentialViolations.push({
							node: expression as Rule.Node,
							identifierName: objectName,
							type: 'memberExpression',
						});
					}
					// If it's a cssMap variable, member expressions are valid - no action needed
				}
			},

			// Final check after all declarations are processed
			'Program:exit'() {
				// Check remaining potential violations against all collected declarations
				potentialViolations.forEach((violation) => {
					if (tracker.xcssVariables.has(violation.identifierName)) {
						context.report({
							node: violation.node,
							messageId: 'noXcssWithCompiled',
						});
					} else if (
						tracker.cssMapVariables.has(violation.identifierName) &&
						violation.type === 'identifier'
					) {
						// Only report cssMap violations for identifier usage (not member expressions)
						// Member expressions like stylesMap.root are valid
						context.report({
							node: violation.node,
							messageId: 'missingCssMapKey',
							data: { identifier: violation.identifierName },
						});
					}
				});
			},
		});
	},
});

export default rule;
