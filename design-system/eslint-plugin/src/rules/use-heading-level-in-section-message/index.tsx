import type { Rule } from 'eslint';
import { isNodeOfType, type JSXAttribute } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-lint-rule';
import { isImportFromPackage } from '../utils/is-import-from-package';

export const headingLevelRequiredSuggestionText =
	'Set SectionMessage.headingLevel to the semantic heading level matching its place in the page outline, for example headingLevel={2} below the page heading; do not choose the level for visual size.';
const SECTION_MESSAGE_PACKAGE = '@atlaskit/section-message';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'use-heading-level-in-section-message',
		type: 'suggestion',
		fixable: 'code',
		docs: {
			description:
				'The `SectionMessage` component in `@atlaskit/section-message` needs to be the correct level within the document flow. This is not something that can be automated and requires contextual knowledge of what is present in the experience.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			headingLevelRequired: headingLevelRequiredSuggestionText,
		},
	},
	create(context) {
		let sectionMessageImportName: string;

		return {
			ImportDeclaration(node) {
				if (!isImportFromPackage(node.source.value, SECTION_MESSAGE_PACKAGE)) {
					return;
				}
				node.specifiers.forEach((spec) => {
					if (isNodeOfType(spec, 'ImportDefaultSpecifier')) {
						sectionMessageImportName = spec.local.name;
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

				if (node.openingElement.name.name === sectionMessageImportName) {
					// and if `title` exists and `headingLevel` prop does not exist
					const sectionMessageProps = node.openingElement.attributes
						.filter((attr): attr is JSXAttribute => isNodeOfType(attr, 'JSXAttribute'))
						.filter((attr: JSXAttribute) => attr.name.type === 'JSXIdentifier');

					const title = sectionMessageProps.find(
						(attr: JSXAttribute) => attr.name.name === 'title',
					);
					const headingLevel = sectionMessageProps.find(
						(attr: JSXAttribute) => attr.name.name === 'headingLevel',
					);

					if (title && !headingLevel) {
						context.report({
							node: node,
							messageId: 'headingLevelRequired',
						});
					}
				}
			},
		};
	},
});

export default rule;
