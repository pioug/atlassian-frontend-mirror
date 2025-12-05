import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const elementsAccessibleNameProps = ['label', 'titleId'];

const rule = createLintRule({
	meta: {
		name: 'use-drawer-label',
		type: 'suggestion',
		docs: {
			description:
				'Encourages to provide accessible name for Atlassian Design System Drawer component.',
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
				if (node.source.value === '@atlaskit/drawer') {
					if (node.specifiers.length) {
						const defaultImport = node.specifiers.filter(
							(spec) => spec.type === 'ImportDefaultSpecifier',
						);
						if (defaultImport.length) {
							const { local } = defaultImport[0];
							contextLocalIdentifier.push(local.name);
						}
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
