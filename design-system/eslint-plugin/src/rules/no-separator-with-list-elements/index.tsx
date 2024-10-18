import type { Rule } from 'eslint';
import { isNodeOfType, type JSXAttribute } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const separatorAsCombinationNotAllowed =
	'The combination of `separator` with `as="li"`, `as="ol"`, or `as="dl"` is not allowed.';

const rule = createLintRule({
	meta: {
		name: 'no-separator-with-list-elements',
		type: 'suggestion',
		docs: {
			description:
				'Warn when the `separator` prop is used with `as="li"`, `as="ol"`, or `as="dl"` in the Inline component.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			separatorAsCombinationNotAllowed,
		},
	},

	create(context: Rule.RuleContext) {
		const inlineComponentNames: string[] = [];

		return {
			ImportDeclaration(node) {
				if (
					node.type === 'ImportDeclaration' &&
					(node.source.value === '../src' || node.source.value === '@atlaskit/primitives')
				) {
					node.specifiers.forEach((specifier) => {
						if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'Inline') {
							inlineComponentNames.push(specifier.local.name);
						}
					});
				}
			},

			JSXElement(node: Rule.Node) {
				if (
					!isNodeOfType(node, 'JSXElement') ||
					!isNodeOfType(node.openingElement.name, 'JSXIdentifier')
				) {
					return;
				}

				const componentName = node.openingElement.name.name;

				if (!inlineComponentNames.includes(componentName)) {
					return;
				}

				const inlineProps = node.openingElement.attributes.filter(
					(attr): attr is JSXAttribute =>
						isNodeOfType(attr, 'JSXAttribute') && isNodeOfType(attr.name, 'JSXIdentifier'),
				);

				const separatorProp = inlineProps.find((attr) => attr.name.name === 'separator');
				const asProp = inlineProps.find((attr) => attr.name.name === 'as');

				if (
					separatorProp &&
					asProp &&
					asProp.value &&
					isNodeOfType(asProp.value, 'Literal') &&
					['li', 'ol', 'dl'].includes(asProp.value.value as string)
				) {
					context.report({
						node: node,
						messageId: 'separatorAsCombinationNotAllowed',
					});
				}
			},
		};
	},
});

export default rule;
