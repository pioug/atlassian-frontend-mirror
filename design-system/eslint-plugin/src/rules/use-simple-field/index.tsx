import type { Rule } from 'eslint';
import { type Identifier, isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const FORM_PACKAGE = '@atlaskit/form';
const MESSAGE_COMPONENTS = ['ErrorMessage', 'HelperMessage', 'ValidMessage'];

export const convertField = 'Convert field to simple field';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'use-simple-field',
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			description:
				'Encourage use of simple field for better developer experience and accessibility.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			useSimpleField: 'The simplified field implementation can be used here.',
		},
	},
	create(context) {
		let fieldImport: string;
		let messageImports: Identifier[] = [];

		return {
			ImportDeclaration(node) {
				const source = node.source.value;

				// Ignore anomalies
				if (typeof source !== 'string') {
					return;
				}

				if (!node.specifiers.length) {
					return;
				}

				// If it's not from our package, ignore.
				if (source !== FORM_PACKAGE) {
					return;
				}

				const namedImportSpecifiers = node.specifiers.filter((spec) =>
					isNodeOfType(spec, 'ImportSpecifier'),
				);
				namedImportSpecifiers.forEach((spec) => {
					if (spec.type === 'ImportSpecifier' && 'name' in spec.imported) {
						const name = spec.imported.name;
						const local = spec.local;
						if (MESSAGE_COMPONENTS.includes(name)) {
							messageImports.push(local);
						} else if (name === 'Field') {
							fieldImport = local.name;
						}
					}
				});
			},
			JSXElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}
				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				// if no field import exists, skip
				if (!fieldImport) {
					return;
				}

				// if component is not field, skip
				if (node.openingElement.name.name !== fieldImport) {
					return;
				}

				// if message imports exist, skip because we can't really dig around
				// inside the field to see if they exist because of memory constraints
				if (messageImports.length > 0) {
					return;
				}

				// if component exists as a prop, skip because it's already simple
				const attributes = node.openingElement.attributes;
				const componentAttr = attributes.find(
					(attr) =>
						isNodeOfType(attr, 'JSXAttribute') &&
						isNodeOfType(attr.name, 'JSXIdentifier') &&
						attr.name.name === 'component',
				);
				if (componentAttr) {
					return;
				}

				// if children is not a render prop, skip
				const renderProps = node.children.find((child) =>
					isNodeOfType(child, 'JSXExpressionContainer'),
				);
				if (!renderProps) {
					return;
				}

				const renderPropExpression = renderProps.expression;
				// If not an arrow func, ignore
				if (!isNodeOfType(renderPropExpression, 'ArrowFunctionExpression')) {
					return;
				}

				const renderPropParams = renderPropExpression.params;
				// if it is not an object pattern, skip
				if (!isNodeOfType(renderPropParams[0], 'ObjectPattern')) {
					return;
				}
				// if component uses more than just fieldProps in render props, skip
				const renderPropArgProperties = renderPropParams[0].properties;
				const fieldPropsProp = renderPropArgProperties.find(
					(property) =>
						isNodeOfType(property, 'Property') &&
						isNodeOfType(property.key, 'Identifier') &&
						property.key.name === 'fieldProps',
				);
				if (renderPropArgProperties.length > 1 || !fieldPropsProp) {
					return;
				}

				const lastProp = attributes.slice(-1)[0] || node.openingElement.name;

				const sourceCode = context.sourceCode;
				const renderPropsText = sourceCode.getText(renderProps);

				context.report({
					node: node,
					messageId: 'useSimpleField',
					suggest: [
						{
							desc: convertField,
							fix: (fixer) => {
								const fixes: Rule.Fix[] = [];

								fixes.push(fixer.insertTextAfter(lastProp, ` component=${renderPropsText} `));
								fixes.push(fixer.remove(renderProps));

								return fixes;
							},
						},
					],
				});
			},
		};
	},
});

export default rule;
