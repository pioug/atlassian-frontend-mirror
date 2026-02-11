import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

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
				'Missing accessible name. Either specify `heading` or if there is a requirement to reference another element in the DOM as accessible name, use `titleId`. Otherwise, use `label` to explicitly provide the accessible name.',
			labelPropShouldHaveContent: 'The Spotlight component requires a non-empty label.',
			headingPropShouldHaveContent: 'The Spotlight component requires a non-empty heading.',
			titleIdShouldHaveValue:
				'`titleId` should reference the id of the element that defines accessible name.',
			noCombinedPropsUsage:
				'Avoid using `heading`, `titleId` and `label` properties simultaneously. If the `heading` value is not specified or there is a requirement to reference another element in the DOM as accessible name, use `titleId`. Otherwise, use `label` to explicitly provide the accessible name.',
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
