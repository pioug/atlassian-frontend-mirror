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
								tracker.compiledComponents.add(specifier.imported.name);
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
				}

				// Track xcss variables
				if (tracker.xcssFunction.has(calleeName)) {
					tracker.xcssVariables.add(variableName);
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
							node: expression,
							messageId: 'noXcssWithCompiled',
						});
					} else if (tracker.cssMapVariables.has(identifierName)) {
						context.report({
							node: expression,
							messageId: 'missingCssMapKey',
							data: { identifier: identifierName },
						});
					}
					return;
				}

				// Check member expressions (e.g., styles.root)
				if (expression.type === 'MemberExpression' && expression.object.type === 'Identifier') {
					const objectName = expression.object.name;

					if (tracker.xcssVariables.has(objectName)) {
						context.report({
							node: expression,
							messageId: 'noXcssWithCompiled',
						});
					}
				}
			},
		});
	},
});

export default rule;
