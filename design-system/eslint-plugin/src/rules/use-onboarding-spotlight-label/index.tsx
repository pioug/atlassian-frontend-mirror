import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-lint-rule';

const elementsAccessibleNameProps = ['label', 'titleId', 'heading'];

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'use-onboarding-spotlight-label',
		type: 'suggestion',
		docs: {
			description:
				'Ensures onboarding spotlight dialogs are described to assistive technology by a direct label or by another element.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			missingAccessibleName:
				'Give Spotlight an accessible name using its visible heading text, titleId referencing an existing heading id, or label when no visible heading exists. Supply only the naming prop appropriate for this spotlight.',
			labelPropShouldHaveContent:
				"Replace Spotlight's empty label with a concise description of the spotlight; if it has a visible heading, name it with heading or titleId instead.",
			headingPropShouldHaveContent:
				"Replace Spotlight's empty heading with the visible title of this spotlight, or use one non-empty titleId or label when no visible heading is intended.",
			titleIdShouldHaveValue:
				'Set Spotlight.titleId to the non-empty id of a rendered element containing its accessible name; ensure that element exists while the spotlight is displayed.',
			noCombinedPropsUsage:
				'Keep one Spotlight naming prop: heading for its visible title, titleId for an existing heading element, or label when no visible title exists. Remove the competing props without losing the intended accessible name.',
		},
		hasSuggestions: true,
	},

	create(context: Rule.RuleContext) {
		const contextLocalIdentifier: string[] = [];

		return {
			ImportDeclaration(node) {
				const buttonGroupIdentifier = node.specifiers?.filter((spec) => {
					if (node.source.value === '@atlaskit/onboarding') {
						return (
							spec.type === 'ImportSpecifier' &&
							'name' in spec.imported &&
							spec.imported?.name === 'Spotlight'
						);
					}
					if (node.source.value === '@atlaskit/onboarding/spotlight') {
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
									messageId: (() => {
										if (prop.name.name === 'label') {
											return 'labelPropShouldHaveContent';
										} else if (prop.name.name === 'titleId') {
											return 'titleIdShouldHaveValue';
										} else {
											return 'headingPropShouldHaveContent';
										}
									})(),
								});
							}
						}
					} else if (componentLabelProps.length > 1) {
						context.report({
							node: node.openingElement,
							messageId: 'noCombinedPropsUsage',
						});
					} else {
						context.report({
							node: node.openingElement,
							messageId: 'missingAccessibleName',
						});
					}
				}
			},
		};
	},
});

export default rule;
