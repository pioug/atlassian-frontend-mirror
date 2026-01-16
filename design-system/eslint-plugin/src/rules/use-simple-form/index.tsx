import type { Rule } from 'eslint';
import { isNodeOfType, type JSXAttribute } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const FORM_PACKAGE = '@atlaskit/form';

export const topLevelAttributeNames = [
	'autocomplete',
	'id',
	'label',
	'labelId',
	'onKeyDown',
	'onSubmit',
	'name',
	'noValidate',
	'ref',
	'xcss',
];
export const convertForm = 'Convert form to simple form';

const rule = createLintRule({
	meta: {
		name: 'use-simple-form',
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			description:
				'Encourage use of simple form for better developer experience and accessibility.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			useSimpleForm: 'The simplified form implementation can be used here.',
		},
	},
	create(context) {
		let formImport: string;

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

				const defaultImportSpecifiers = node.specifiers.filter((spec) =>
					isNodeOfType(spec, 'ImportDefaultSpecifier'),
				);
				if (defaultImportSpecifiers.length > 0) {
					formImport = defaultImportSpecifiers[0].local.name;
				}
			},
			JSXElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}
				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				// if no form import exists, skip
				if (!formImport) {
					return;
				}

				// if component is not field, skip
				if (node.openingElement.name.name !== formImport) {
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
				// if component uses more than just formProps in render props, skip
				const renderPropArgProperties = renderPropParams[0].properties;
				const formPropsProp = renderPropArgProperties.find(
					(property) =>
						isNodeOfType(property, 'Property') &&
						isNodeOfType(property.key, 'Identifier') &&
						property.key.name === 'formProps',
				);
				if (renderPropArgProperties.length > 1 || !formPropsProp) {
					return;
				}

				const attributes = node.openingElement.attributes;
				const lastProp = attributes.slice(-1)[0] || node.openingElement.name;

				const sourceCode = context.sourceCode;

				// if html form is not first child, don't give a fix
				const renderPropBody = renderPropExpression.body;
				const firstChildIsHTMLForm =
					isNodeOfType(renderPropBody, 'JSXElement') &&
					isNodeOfType(renderPropBody.openingElement.name, 'JSXIdentifier') &&
					renderPropBody.openingElement.name.name === 'form';

				// If this is not an HTML form. skip because we can't convert
				if (!firstChildIsHTMLForm) {
					return;
				}

				context.report({
					node: node,
					messageId: 'useSimpleForm',
					suggest: [
						{
							desc: convertForm,
							fix: (fixer) => {
								const fixes: Rule.Fix[] = [];

								// add each attribute in the HTML form inside to the AK form
								const attrs: Record<string, JSXAttribute[]> = { topLevel: [], formProps: [] };
								const htmlFormAttributes = renderPropBody.openingElement.attributes;
								htmlFormAttributes.forEach((attr) => {
									if (
										isNodeOfType(attr, 'JSXAttribute') &&
										isNodeOfType(attr.name, 'JSXIdentifier')
									) {
										if (topLevelAttributeNames.includes(attr.name.name)) {
											attrs.topLevel.push(attr);
										} else {
											attrs.formProps.push(attr);
										}
									}
								});
								attrs.topLevel.forEach((attr) => {
									fixes.push(fixer.insertTextAfter(lastProp, ` ${sourceCode.getText(attr)}`));
								});
								if (attrs.formProps.length > 0) {
									const formPropsText = attrs.formProps
										.map((attr) => {
											return sourceCode
												.getText(attr)
												.replace(/^([^=]*)/, "'$1'")
												.replace('=', ': ');
										})
										.join(',\n');
									fixes.push(
										fixer.insertTextAfter(lastProp, ` formProps={{\n${formPropsText}\n}} `),
									);
								}

								// remove the body of the AK form
								fixes.push(fixer.remove(renderProps));

								// Get all children text of HTML form to be added to AK form
								let childrenText = '<>';
								renderPropBody.children.forEach((child) => {
									// Doing `as any` because it doesn't like spread props. I
									// added a test that verifies that this does indeed work,
									// though, so it's fine.
									childrenText += sourceCode.getText(child as any);
								});
								childrenText += '</>';

								// Add the children of the HTML form to the children of the AK form
								node.closingElement &&
									fixes.push(fixer.insertTextBefore(node.closingElement, childrenText));

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
