import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-lint-rule';

const elementsAccessibleNameProps = ['label', 'titleId'];

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'use-button-group-label',
		type: 'suggestion',
		docs: {
			description:
				'Ensures button groups are described to assistive technology by a direct label or by another element.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			missingLabelProp:
				'Give ButtonGroup an accessible name: set titleId to the id of its visible heading, or set label to a concise description of the group of actions when no heading exists.',
			labelPropShouldHaveContents:
				'Replace the empty ButtonGroup label with text describing the group of actions; if a visible heading already provides that name, use titleId to reference its id instead.',
			titleIdShouldHaveValue:
				'Set ButtonGroup.titleId to the non-empty id of a rendered element containing its accessible name; ensure that element exists while the group of actions is displayed.',
			noBothPropsUsage:
				'Keep one naming prop on ButtonGroup: titleId when referencing a visible heading, otherwise label. Remove the other prop without deleting the intended accessible name.',
		},
		hasSuggestions: true,
	},

	create(context: Rule.RuleContext) {
		const contextLocalIdentifier: string[] = [];

		return {
			ImportDeclaration(node) {
				const buttonGroupIdentifier = node.specifiers?.filter((spec) => {
					if (node.source.value === '@atlaskit/button') {
						return (
							spec.type === 'ImportSpecifier' &&
							'name' in spec.imported &&
							spec.imported?.name === 'ButtonGroup'
						);
					}
					if (node.source.value === '@atlaskit/button/button-group') {
						return spec.type === 'ImportDefaultSpecifier';
					}
				});
				if (buttonGroupIdentifier?.length) {
					const { local } = buttonGroupIdentifier[0];
					contextLocalIdentifier.push(local.name);
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
						context.report({
							node: node.openingElement,
							messageId: 'missingLabelProp',
						});
					}
				}
			},
		};
	},
});

export default rule;
