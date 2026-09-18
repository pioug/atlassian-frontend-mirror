import type { Rule } from 'eslint';
import { isNodeOfType, type JSXAttribute } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-lint-rule';
import { findProp } from '../utils/find-prop';

/**
 * Entry points whose default export is an icon-only control, where the `label`
 * prop is the sole source of the accessible name.
 */
const DEFAULT_IMPORT_SOURCES = new Set([
	'@atlaskit/button/icon/button',
	'@atlaskit/button/icon/link',
]);

/**
 * Deprecated entry point that still re-exports the icon-only controls by name.
 */
const NAMED_IMPORT_SOURCES = new Set(['@atlaskit/button/new']);

const NAMED_IMPORTS = new Set(['IconButton', 'LinkIconButton']);

const normalize = (value: string): string => value.trim();

/**
 * Resolves a `label` prop to a static string, or `undefined` when the value
 * cannot be determined statically. Dynamic values are intentionally skipped so
 * the rule never guesses at the contents of a variable, function call or
 * interpolated template.
 */
const getStaticLabel = (attribute: JSXAttribute): string | null | undefined => {
	const { value } = attribute;

	if (value === null || value === undefined) {
		return undefined;
	}

	if (isNodeOfType(value, 'Literal')) {
		if (typeof value.value === 'string') {
			return value.value;
		}

		return value.value === null || value.value === false ? null : undefined;
	}

	if (!isNodeOfType(value, 'JSXExpressionContainer')) {
		return undefined;
	}

	const expression = value.expression;

	if (isNodeOfType(expression, 'Literal')) {
		if (typeof expression.value === 'string') {
			return expression.value;
		}

		return expression.value === null || expression.value === false ? null : undefined;
	}

	if (isNodeOfType(expression, 'Identifier') && expression.name === 'undefined') {
		return null;
	}

	// Only template literals without interpolation are static. A template with
	// expressions is assumed to include distinguishing context.
	if (isNodeOfType(expression, 'TemplateLiteral')) {
		if (expression.expressions.length > 0) {
			return undefined;
		}

		return expression.quasis.map((quasi) => quasi.value.cooked ?? '').join('');
	}

	return undefined;
};

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-empty-icon-button-label',
		type: 'problem',
		docs: {
			description:
				'Ensures icon-only Atlassian Design System buttons do not have an empty accessible name.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			emptyLabel:
				'The `label` prop is the only accessible name for an icon-only button, so it must not be empty.',
		},
	},

	create(context: Rule.RuleContext) {
		const iconButtonNames = new Set<string>();

		return {
			ImportDeclaration(node: any) {
				const source = String(node.source.value);

				if (DEFAULT_IMPORT_SOURCES.has(source)) {
					node.specifiers.forEach((specifier: any) => {
						if (isNodeOfType(specifier, 'ImportDefaultSpecifier')) {
							iconButtonNames.add(specifier.local.name);
						}
					});
					return;
				}

				if (NAMED_IMPORT_SOURCES.has(source)) {
					node.specifiers.forEach((specifier: any) => {
						if (
							isNodeOfType(specifier, 'ImportSpecifier') &&
							isNodeOfType(specifier.imported, 'Identifier') &&
							NAMED_IMPORTS.has(specifier.imported.name)
						) {
							iconButtonNames.add(specifier.local.name);
						}
					});
				}
			},

			JSXElement(node: any) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}

				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				if (!iconButtonNames.has(node.openingElement.name.name)) {
					return;
				}

				const labelProp = findProp(node, 'label');

				// A missing `label` is already a type error, so it is not reported here.
				if (!labelProp) {
					return;
				}

				const label = getStaticLabel(labelProp);

				if (label === undefined) {
					return;
				}

				if (label === null || normalize(label) === '') {
					context.report({
						node: labelProp,
						messageId: 'emptyLabel',
					});
					return;
				}
			},
		};
	},
});

export default rule;
