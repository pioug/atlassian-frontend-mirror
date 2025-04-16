import type { Rule } from 'eslint';
import { isNodeOfType, type JSXAttribute } from 'eslint-codemod-utils';

import { getScope } from '@atlaskit/eslint-utils/context-compat';

import { createLintRule } from '../utils/create-rule';
import { getImportName } from '../utils/get-import-name';

export const headingLevelRequiredSuggestionText =
	'Add a `headingLevel` that is of a contextually relevant level.';

const rule = createLintRule({
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
		return {
			JSXElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}

				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				// Get the name of the SpotlightCard import
				const spotlightCardImportName = getImportName(
					getScope(context, node),
					'@atlaskit/onboarding',
					'SpotlightCard',
				);

				if (node.openingElement.name.name === spotlightCardImportName) {
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
