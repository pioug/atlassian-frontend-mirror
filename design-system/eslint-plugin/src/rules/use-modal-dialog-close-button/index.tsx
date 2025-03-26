// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import { isNodeOfType, type JSXElement } from 'eslint-codemod-utils';

import { JSXAttribute } from '../../ast-nodes/jsx-attribute';
import { JSXElementHelper } from '../../ast-nodes/jsx-element';
import { createLintRule } from '../utils/create-rule';

const PROP_NAME = 'hasCloseButton';

// Lint rule message
const message =
	'`hasCloseButton` should be set to `true` or the `CloseButton` component should be used to make modal dialog accessible.';

// Fix messages
export const addHasCloseButtonProp = 'Add `hasCloseButton` prop.';
export const setHasCloseButtonPropToTrue = 'Set `hasCloseButton` prop to `true`.';
export const useCloseButtonOrNewProp =
	'Set `hasCloseButton` prop to `true` in `ModalHeader` or use `CloseButton` export if customization is desired.';

export const ruleName = __dirname.split('/').slice(-1)[0];

const rule = createLintRule({
	meta: {
		name: ruleName,
		type: 'suggestion',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description:
				"Encourages makers to use close button in Atlassian Design System's modal dialog component.",
			recommended: true,
			severity: 'warn',
		},
		messages: {
			modalHeaderMissingHasCloseButtonProp: message,
			modalHeaderHasCloseButtonPropIsFalse: message,
			noCloseButtonExists: message,
		},
	},

	create(context: Rule.RuleContext) {
		// List of component's locally imported names that match
		let defaultImportLocalName: string;
		let modalHeaderLocalName: string;
		let closeButtonLocalName: string;

		return {
			// Only run rule in files where the package is imported
			ImportDeclaration(node) {
				// Ignore non-modal imports
				if (node.source.value !== '@atlaskit/modal-dialog') {
					return;
				}

				node.specifiers.forEach((identifier) => {
					if (isNodeOfType(identifier, 'ImportDefaultSpecifier')) {
						defaultImportLocalName = identifier.local.name;
					} else if (isNodeOfType(identifier, 'ImportSpecifier')) {
						const importName = identifier.imported.name;
						const localName = identifier.local.name;
						if (importName === 'ModalHeader') {
							modalHeaderLocalName = localName;
						} else if (importName === 'CloseButton') {
							closeButtonLocalName = localName;
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

				const name = node.openingElement.name.name;

				if (name !== defaultImportLocalName) {
					return;
				}

				let modalHeaderNode: JSXElement | null = null;
				let closeButtonNode: JSXElement | null = null;

				const checkNode = (node: any) => {
					if (modalHeaderNode && closeButtonNode) {
						return;
					}

					// Add expression conatiner's body if an expression container
					if (isNodeOfType(node, 'JSXExpressionContainer')) {
						if (
							(isNodeOfType(node.expression, 'ArrowFunctionExpression') ||
								isNodeOfType(node.expression, 'FunctionExpression')) &&
							isNodeOfType(node.expression.body, 'JSXElement')
						) {
							searchNode(node.expression.body, true);
						} else if (isNodeOfType(node.expression, 'LogicalExpression')) {
							const { left, right } = node.expression;
							[left, right].forEach((e) => {
								if (isNodeOfType(e, 'JSXElement')) {
									searchNode(e, true);
								}
							});
						}
					}

					// Skip if not a JSX Element
					if (!isNodeOfType(node, 'JSXElement')) {
						return;
					}

					// Skip if opening element is not an identifier
					if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
						return;
					}

					// if child is CloseButton, return true
					if (node.openingElement.name.name === closeButtonLocalName) {
						closeButtonNode = node;
					} else if (node.openingElement.name.name === modalHeaderLocalName) {
						modalHeaderNode = node;
					}

					if (node.children) {
						searchNode(node);
					}
				};

				const searchNode = (node: JSXElement, searchSelf: boolean = false) => {
					if (searchSelf) {
						checkNode(node);
					}

					for (let child of node.children) {
						checkNode(child);
					}
				};

				searchNode(node);

				// If there is a close button, skip the rest, as this satisfies the rule.
				if (closeButtonNode) {
					return;
					// No close button exists, so check the modal header
				} else if (modalHeaderNode !== null) {
					const prop = JSXElementHelper.getAttributeByName(modalHeaderNode, PROP_NAME);

					// If the prop exists
					if (prop) {
						const attrValue = JSXAttribute.getValue(prop);
						// If the value is a boolean with value `false`
						if (attrValue?.type === 'ExpressionStatement Literal' && attrValue?.value === false) {
							return context.report({
								node: modalHeaderNode,
								messageId: 'modalHeaderHasCloseButtonPropIsFalse',
								suggest: [
									{
										desc: setHasCloseButtonPropToTrue,
										// Set to true by setting to boolean HTML/JSX attribute
										fix: (fixer) => [fixer.replaceText(prop, PROP_NAME)],
									},
								],
							});
						}
						// If the prop does not exist
					} else {
						return context.report({
							node: modalHeaderNode,
							messageId: 'modalHeaderMissingHasCloseButtonProp',
							suggest: [
								{
									desc: addHasCloseButtonProp,
									fix: (fixer) => [
										fixer.insertTextAfter(modalHeaderNode!.openingElement.name, ` ${PROP_NAME}`),
									],
								},
							],
						});
					}
					// No close button or modal header exists
				} else {
					return context.report({
						node,
						messageId: 'noCloseButtonExists',
					});
				}
			},
		};
	},
});

export default rule;
