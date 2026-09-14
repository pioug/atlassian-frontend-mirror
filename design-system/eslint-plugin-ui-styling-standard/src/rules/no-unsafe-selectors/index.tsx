import type { Rule } from 'eslint';
import type * as ESTree from 'eslint-codemod-utils';

import { importSources } from '@atlaskit/eslint-utils/schema';

import { createLintRuleWithTypedConfig } from '../utils/create-rule-with-typed-config';
import { isSimpleSelector } from '../utils/is-simple-selector';
import { parseSelector } from '../utils/parse-selector';
import { getStyleCalls } from '../utils/style-calls';
import { walkStyleCallProperties } from '../utils/walk-style-call-properties';

import { lintSelector } from './lint-selector';
import { walkCssMapCall } from './walk-css-map';
import { allowedPseudos } from './constants';

const ignoredAtRules: Set<string> = new Set([
	'@container', // ignored because it's covered by `no-container-queries`
	'@media', // ignored because it's covered by `no-nested-styles`
	'@supports',
	'@property',
	'@starting-style',
]);

const rule: Rule.RuleModule = createLintRuleWithTypedConfig({
	meta: {
		name: 'no-unsafe-selectors',
		docs: {
			description: 'Disallows use of nested styles in `css` functions.',
			recommended: true,
			severity: 'error',
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
			Program() {
				for (const styleCall of getStyleCalls(context)) {
					if (!config.importSources.includes(styleCall.importSource)) {
						continue;
					}
					if (styleCall.styleFunction === 'cssMap') {
						walkCssMapCall(styleCall.node, (property) => {
							const { type, node } = property;

							if (type === 'grouped-at-rules') {
								context.report({ node: node.key, messageId: 'no-grouped-at-rules' });
							} else if (type === 'selectors') {
								context.report({ node: node.key, messageId: 'no-selectors-object' });
							}
						});
					}

					walkStyleCallProperties(styleCall, ({ key, value }) => {
						if (
							value.type !== 'ObjectExpression' ||
							key.type !== 'Literal' ||
							typeof key.value !== 'string'
						) {
							return;
						}

						const selectorText = key.value;
						if (selectorText.includes('@')) {
							lintAtRule({ context, sourceNode: key, atRule: selectorText });
							return;
						}
						if (
							isSimpleSelector(selectorText, {
								allowedPseudos,
								allowLeadingPseudo: styleCall.styleFunction === 'xcss',
							})
						) {
							return;
						}

						try {
							const selectorList = parseSelector(context, selectorText);
							for (const selector of selectorList.nodes) {
								lintSelector({
									context,
									sourceNode: key,
									selector,
									config,
									isXcssCall: styleCall.styleFunction === 'xcss',
								});
							}
						} catch {
							context.report({
								node: key,
								messageId: 'no-unparsable-selectors',
								data: { selectorText },
							});
						}
					});
				}
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
