import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { getScope } from '@atlaskit/eslint-utils/context-compat';

import { createLintRule } from '../utils/create-rule';
import { findIdentifierInParentScope } from '../utils/find-in-parent';

const allowedPrefix = [':', '&:'];
const allowedResponsiveImports = ['@atlaskit/primitives/responsive', '@atlaskit/primitives'];

/**
 * Tests against properties using the Design System primitives media object: [media.above.md]
 * @returns true if the property is a media query
 */
const isMediaObject = (node: Rule.Node, context: Rule.RuleContext) => {
	if (node.type === 'MemberExpression') {
		if (node.object.type === 'MemberExpression' && node.object.object.type === 'Identifier') {
			const scope = getScope(context, node);
			const variable = findIdentifierInParentScope({
				scope,
				identifierName: node.object.object.name,
			});

			if (!variable) {
				return false;
			}

			const definition = variable.defs[0];

			// Make sure it's coming from the primitives packages and isn't a bootleg media query or worse: nested styles
			if (
				isNodeOfType(definition.node, 'ImportSpecifier') &&
				definition.node.parent &&
				isNodeOfType(definition.node.parent, 'ImportDeclaration') &&
				allowedResponsiveImports.includes(definition.node.parent.source.value as string)
			) {
				// This should match the name of the media object exported from packages/design-system/primitives/src/responsive/media-helper.tsx
				return (
					definition.node.imported.type === 'Identifier' &&
					definition.node.imported.name === 'media'
				);
			}
		}
	}
	return false;
};

const parseSelector = (rawSelector: unknown): string[] => {
	if (typeof rawSelector !== 'string') {
		throw new Error('expected string');
	}

	const selectors = rawSelector.split(',').map((selector) => selector.trim());
	return selectors;
};

const getKeyValue = (node: Rule.Node, context: Rule.RuleContext): string => {
	if (node.type === 'Identifier') {
		return node.name;
	}

	if (node.type === 'Literal' && typeof node.value === 'string') {
		return node.value;
	}

	if (isMediaObject(node, context)) {
		return '@media';
	}

	return '';
};

// const isWidthMediaQuery = (rawSelector: string): boolean => {
// 	const selectors = parseSelector(rawSelector);

// 	if (selectors[0].startsWith('@')) {
// 		// If the selector includes a min-width/max-width query, return false - the primitives media object should be used instead:
// 		// https://staging.atlassian.design/components/primitives/responsive/breakpoints/examples
// 		// Otherwise return true, non-width queries are acceptable
// 		return selectors.some(
// 			(selector) => selector.includes('min-width') || selector.includes('max-width'),
// 		);
// 	}
// 	return false;
// };

const isAllowedNestedSelector = (rawSelector: string): boolean => {
	if (rawSelector.trim() === '&') {
		// This can be written without the nest.
		return false;
	}

	const selectors = parseSelector(rawSelector);

	if (selectors[0].startsWith('@')) {
		// Bail early as it's an at selector. Width queries are handled by `isWidthMediaQuery`.
		return true;
	}

	return selectors.every((selector) => {
		return selector === '&' || allowedPrefix.find((prefix) => selector.startsWith(prefix));
	});
};

const isUsingDirectDataAttribute = (rawSelector: string): boolean => {
	const selectors = parseSelector(rawSelector);
	return selectors.some((selector) => selector.startsWith('&['));
};

const rule = createLintRule({
	meta: {
		name: 'no-nested-styles',
		docs: {
			description: 'Disallows use of nested styles in `css` functions.',
			recommended: true,
			severity: 'error',
		},
		messages: {
			// noWidthQueries:
			// 	'Media queries that target min-width or max-width are not allowed. Use the media object provided by the Atlassian Design System instead. https://staging.atlassian.design/components/primitives/responsive/breakpoints/examples',
			noNestedStyles:
				'Nested styles are not allowed as they can change unexpectedly when child markup changes and result in duplicates when extracting to CSS.',
			noDirectNestedStyles: `Styles applied with data attributes are not allowed, split them into discrete CSS declarations and apply them conditionally with JavaScript.

\`\`\`
const disabledStyles = css({ opacity: 0.5 });

<div css={isDisabled && disabledStyles} />
\`\`\`
`,
		},
	},
	create(context) {
		return {
			'CallExpression[callee.name=css] > ObjectExpression Property,CallExpression[callee.name=xcss] > ObjectExpression Property':
				(node: Rule.Node) => {
					if (node.type !== 'Property' || node.value.type !== 'ObjectExpression') {
						return;
					}

					if (isUsingDirectDataAttribute(getKeyValue(node.key as Rule.Node, context))) {
						context.report({
							node,
							messageId: 'noDirectNestedStyles',
						});

						return;
					}

					// if (isWidthMediaQuery(getKeyValue(node.key as Rule.Node, context))) {
					// 	context.report({
					// 		node,
					// 		messageId: 'noWidthQueries',
					// 	});

					// 	return;
					// }

					if (!isAllowedNestedSelector(getKeyValue(node.key as Rule.Node, context))) {
						context.report({
							node,
							messageId: 'noNestedStyles',
						});

						return;
					}
				},
		};
	},
});

export default rule;
