import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-lint-rule';

const elementsAccessibleNameProps = ['label', 'titleId'];
const POPUP_PACKAGE = '@atlaskit/popup';
const POPUP_IMPORT_SOURCE = '@atlaskit/popup/popup';
const ENTRY_POINT_POPUP_PACKAGE = '@atlassian/entry-points/popup-trigger';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'use-popup-label',
		type: 'suggestion',
		docs: {
			description:
				'Encourages to provide accessible name for Atlassian Design System Popup component.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			missingLabelProp:
				'Missing accessible name. If there is no visible content to associate use `label` prop, otherwise pass id of element to `titleId` prop to be associated as label.',
			labelPropShouldHaveContents: 'Define string that labels the interactive element.',
			titleIdShouldHaveValue:
				'`titleId` should reference the id of element that define accessible name.',
			noBothPropsUsage:
				'Do not include both `titleId` and `label` properties. Use `titleId` if the label text is available in the DOM to reference it, otherwise use `label` to provide accessible name explicitly.',
		},
		hasSuggestions: true,
	},

	create(context: Rule.RuleContext) {
		const contextLocalIdentifier: string[] = [];

		return {
			ImportDeclaration(node) {
				if (
					node.source.value === POPUP_PACKAGE ||
					node.source.value === POPUP_IMPORT_SOURCE ||
					node.source.value === ENTRY_POINT_POPUP_PACKAGE
				) {
					if (node.specifiers.length) {
						node.specifiers.forEach((spec) => {
							if (
								spec.type === 'ImportDefaultSpecifier' &&
								node.source.value !== ENTRY_POINT_POPUP_PACKAGE
							) {
								contextLocalIdentifier.push(spec.local.name);
							}

							if (spec.type === 'ImportSpecifier' && 'name' in spec.imported) {
								if (node.source.value === POPUP_IMPORT_SOURCE && spec.imported.name === 'Popup') {
									contextLocalIdentifier.push(spec.local.name);
								}

								if (
									node.source.value === ENTRY_POINT_POPUP_PACKAGE &&
									spec.imported.name === 'PopupTrigger'
								) {
									contextLocalIdentifier.push(spec.local.name);
								}
							}
						});
					}
				}
			},

			JSXElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}

				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				const name = node.openingElement.name.name;

				if (contextLocalIdentifier.includes(name)) {
					const componentRoleDialogProp = node.openingElement.attributes.find(
						(attr) =>
							isNodeOfType(attr, 'JSXAttribute') &&
							isNodeOfType(attr.name, 'JSXIdentifier') &&
							attr.value &&
							isNodeOfType(attr.value, 'Literal') &&
							attr.name.name === 'role' &&
							attr.value.value === 'dialog',
					);

					const componentLabelProps = node.openingElement.attributes.filter(
						(attr) =>
							isNodeOfType(attr, 'JSXAttribute') &&
							isNodeOfType(attr.name, 'JSXIdentifier') &&
							elementsAccessibleNameProps.includes(attr.name.name),
					);

					if (componentLabelProps.length === 1) {
						const prop = componentLabelProps[0];

						if ('value' in prop && prop.value) {
							if (
								(isNodeOfType(prop.value, 'Literal') && !prop.value.value) ||
								(isNodeOfType(prop.value, 'JSXExpressionContainer') && !prop.value.expression)
							) {
								context.report({
									node: prop,
									messageId:
										prop.name.name === 'label'
											? 'labelPropShouldHaveContents'
											: 'titleIdShouldHaveValue',
								});
							}
						}
					} else if (componentLabelProps.length > 1) {
						context.report({
							node: node.openingElement,
							messageId: 'noBothPropsUsage',
						});
					} else {
						if (componentRoleDialogProp) {
							context.report({
								node: node.openingElement,
								messageId: 'missingLabelProp',
							});
						} else {
							return;
						}
					}
				}
			},
		};
	},
});

export default rule;
