import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-lint-rule';
import { isImportFromPackage } from '../utils/is-import-from-package';

const elementsAccessibleNameProps = ['label', 'titleId'];
const TAG_GROUP_PACKAGE = '@atlaskit/tag-group';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'use-tag-group-label',
		type: 'suggestion',
		docs: {
			description:
				'Ensures tag groups are described to assistive technology by a direct label or by another element.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			missingLabelProp:
				'Give TagGroup an accessible name: set titleId to the id of its visible heading, or set label to a concise description of the group of tags when no heading exists.',
			labelPropShouldHaveContents:
				'Replace the empty TagGroup label with text describing the group of tags; if a visible heading already provides that name, use titleId to reference its id instead.',
			titleIdShouldHaveValue:
				'Set TagGroup.titleId to the non-empty id of a rendered element containing its accessible name; ensure that element exists while the group of tags is displayed.',
			noBothPropsUsage:
				'Keep one naming prop on TagGroup: titleId when referencing a visible heading, otherwise label. Remove the other prop without deleting the intended accessible name.',
		},
		hasSuggestions: true,
	},

	create(context: Rule.RuleContext) {
		const contextLocalIdentifier: string[] = [];

		return {
			ImportDeclaration(node) {
				if (isImportFromPackage(node.source.value, TAG_GROUP_PACKAGE)) {
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
