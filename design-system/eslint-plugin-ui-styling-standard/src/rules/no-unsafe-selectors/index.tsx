import type { Rule } from 'eslint';
import type * as ESTree from 'eslint-codemod-utils';
import cssSelectorParser from 'postcss-selector-parser';

import { isXcss } from '@atlaskit/eslint-utils/is-supported-import';
import { importSources } from '@atlaskit/eslint-utils/schema';
import { walkStyleProperties } from '@atlaskit/eslint-utils/walk-style-properties';

import { createLintRuleWithTypedConfig } from '../utils/create-rule-with-typed-config';

import { ignoredAtRules } from './constants';
import { lintSelector } from './lint-selector';
import { walkCssMap } from './walk-css-map';

const cssSelectorProcessor = cssSelectorParser();

const rule = createLintRuleWithTypedConfig({
	meta: {
		name: 'no-unsafe-selectors',
		docs: {
			description: 'Disallows use of nested styles in `css` functions.',
			recommended: true,
			severity: 'warn',
		},
		fixable: 'code',
		hasSuggestions: true,
		messages: {
			/**
			 * Selector messages
			 */
			'no-ambiguous-pseudos':
				'Pseudo-classes and pseudo-elements without a leading selector are ambiguous. Use a more explicit selector.',

			'no-increased-specificity': 'Do not chain the nesting selector.',

			'no-restricted-pseudos': 'The {{pseudo}} pseudo is not allowed.',

			'no-legacy-pseudo-element-syntax':
				'Use a double colon for pseudo-elements. The single colon syntax is not supported for all pseudo-elements.',

			'no-unparsable-selectors':
				"The selector '{{selectorText}}' could not be parsed and is likely an authoring mistake. If you think this is an error reach out in #help-ui-styling-standard.",

			'no-selectors-object':
				'Do not use the selectors object. Both nested and advanced selectors should be avoided.',

			/**
			 * At-rule messages
			 */
			'no-keyframes-at-rules':
				'Use the CSS-in-JS `keyframes` API instead of `@keyframes` at-rules.',

			'no-restricted-at-rules': '{{atRule}} at-rule is not allowed.',

			'no-grouped-at-rules': 'Do not group at-rules. Write flattened at-rules instead.',

			/**
			 * Suggestion messages
			 */
			'insert-nesting-selector':
				'Insert a nesting selector `&` to target the element itself. This is usually the intended behavior.',
		},

		schema: {
			type: 'object',
			properties: {
				importSources,
				shouldAlwaysInsertNestingSelectorForAmbiguousPseudos: {
					type: 'boolean',
					default: true,
				},
			},
			additionalProperties: false,
		},
	},
	create(context, config) {
		return {
			Program(program) {
				walkCssMap({
					context,
					program,
					importSources: config.importSources,
					visitor(property) {
						const { type, node } = property;

						if (type === 'grouped-at-rules') {
							context.report({
								node: node.key,
								messageId: 'no-grouped-at-rules',
							});
							return;
						}

						if (type === 'selectors') {
							context.report({
								node: node.key,
								messageId: 'no-selectors-object',
							});
							return;
						}
					},
				});
			},
			CallExpression(node: ESTree.CallExpression) {
				const { references } = context.getScope();

				const isXcssCall = isXcss(node, references, config.importSources);

				walkStyleProperties(node, references, config.importSources, ({ key, value }) => {
					/**
					 * If the value isn't an object expression then the key can't be a selector.
					 *
					 * This assumes all styles have to be inline, which is enforced by `no-unsafe-values`
					 */
					if (value.type !== 'ObjectExpression') {
						return;
					}

					/**
					 * Technically the key could be an identifier too, e.g.
					 *
					 * ```ts
					 * css({
					 *   // This key is an identifier, not a literal
					 *   selector: {}
					 * });
					 * ```
					 *
					 * But an identifier couldn't violate anything in this rule,
					 * because it can't contain '@' or ':' characters.
					 */
					if (key.type !== 'Literal' || typeof key.value !== 'string') {
						return;
					}

					const selectorText = key.value;

					if (selectorText.includes('@')) {
						lintAtRule({ context, sourceNode: key, atRule: selectorText });
						return;
					}

					try {
						const selectorList = cssSelectorProcessor.astSync(selectorText);

						selectorList.nodes.forEach((selector) =>
							lintSelector({ context, sourceNode: key, selector, config, isXcssCall }),
						);
					} catch (e) {
						context.report({
							node: key,
							messageId: 'no-unparsable-selectors',
							data: { selectorText },
						});
					}
				});
			},
		};
	},
});

export default rule;

function lintAtRule({
	context,
	sourceNode,
	atRule,
}: {
	context: Rule.RuleContext;
	sourceNode: ESTree.Node;
	atRule: string;
}) {
	const matches = atRule.trim().match(/^@[A-z-]+/);
	if (!matches) {
		return;
	}

	const ruleName = matches[0];

	if (ignoredAtRules.has(ruleName)) {
		return;
	}

	if (ruleName === '@keyframes') {
		context.report({
			node: sourceNode,
			messageId: 'no-keyframes-at-rules',
		});
	} else {
		context.report({
			node: sourceNode,
			messageId: 'no-restricted-at-rules',
			data: {
				atRule: ruleName,
			},
		});
	}
}
