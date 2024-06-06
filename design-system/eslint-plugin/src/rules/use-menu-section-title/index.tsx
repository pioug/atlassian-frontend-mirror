// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const elementsAccessibleNameProps = ['title', 'titleId'];

const rule = createLintRule({
	meta: {
		name: 'use-menu-section-title',
		type: 'suggestion',
		docs: {
			description:
				'Encourages makers to provide accessible title for Atlassian Design System Menu Section component.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			missingTitleProp:
				'Missing accessible title. If there is no visible content to associate use `title` prop, otherwise pass id of element to `titleId` prop to be associated as label.',
			titlePropShouldHaveContents: 'Define the string that labels the interactive element.',
			titleIdShouldHaveValue:
				'`titleId` should reference the id of the element that defines the accessible name.',
			noBothPropsUsage:
				'Do not include both `titleId` and `title` properties. Use `titleId` if the label text is available in the DOM to reference it, otherwise use `title` to provide accessible name explicitly.',
		},
		hasSuggestions: true,
	},

	create(context: Rule.RuleContext) {
		const contextLocalIdentifier: string[] = [];

		return {
			ImportDeclaration(node) {
				const menuSectionIdentifier = node.specifiers?.filter((spec) => {
					if (node.source.value === '@atlaskit/menu') {
						return spec.type === 'ImportSpecifier' && spec.imported?.name === 'Section';
					} else if (node.source.value === '@atlaskit/menu/section') {
						return spec.type === 'ImportDefaultSpecifier';
					}
				});
				if (menuSectionIdentifier?.length) {
					const { local } = menuSectionIdentifier[0];
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
										prop.name.name === 'title'
											? 'titlePropShouldHaveContents'
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
							messageId: 'missingTitleProp',
						});
					}
				}
			},
		};
	},
});

export default rule;
