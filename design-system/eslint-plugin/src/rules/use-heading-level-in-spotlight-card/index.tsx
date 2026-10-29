import type { Rule } from 'eslint';
import { isNodeOfType, type JSXAttribute } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-lint-rule';

export const headingLevelRequiredSuggestionText =
	'Set SpotlightCard.headingLevel to the semantic heading level matching its place in the page outline, for example headingLevel={2} below the page heading; do not choose the level for visual size.';
const ONBOARDING_PACKAGE = '@atlaskit/onboarding';
const SPOTLIGHT_CARD_IMPORT_SOURCE = '@atlaskit/onboarding/spotlight-card';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'use-heading-level-in-spotlight-card',
		type: 'suggestion',
		fixable: 'code',
		docs: {
			description:
				'Inform developers of eventual requirement of `headingLevel` prop in `SpotlightCard` component. The heading level should be the appropriate level according to the surrounding context.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			headingLevelRequired: headingLevelRequiredSuggestionText,
		},
	},
	create(context) {
		const spotlightCardImportNames: string[] = [];

		return {
			ImportDeclaration(node: Rule.Node) {
				if (!isNodeOfType(node, 'ImportDeclaration')) {
					return;
				}

				node.specifiers.forEach((spec) => {
					if (
						node.source.value === ONBOARDING_PACKAGE &&
						isNodeOfType(spec, 'ImportSpecifier') &&
						spec.imported.name === 'SpotlightCard'
					) {
						spotlightCardImportNames.push(spec.local.name);
					}

					if (
						node.source.value === SPOTLIGHT_CARD_IMPORT_SOURCE &&
						isNodeOfType(spec, 'ImportDefaultSpecifier')
					) {
						spotlightCardImportNames.push(spec.local.name);
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

				if (spotlightCardImportNames.includes(node.openingElement.name.name)) {
					// and if `heading` exists and `headingLevel` prop does not exist
					const spotlightCardProps = node.openingElement.attributes
						.filter((attr): attr is JSXAttribute => isNodeOfType(attr, 'JSXAttribute'))
						.filter((attr: JSXAttribute) => attr.name.type === 'JSXIdentifier');

					const heading = spotlightCardProps.find(
						(attr: JSXAttribute) => attr.name.name === 'heading',
					);
					const headingLevel = spotlightCardProps.find(
						(attr: JSXAttribute) => attr.name.name === 'headingLevel',
					);

					if (heading && !headingLevel) {
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
