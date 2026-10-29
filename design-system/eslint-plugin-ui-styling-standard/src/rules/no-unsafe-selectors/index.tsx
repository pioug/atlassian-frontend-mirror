import type { Rule } from 'eslint';
import type * as ESTree from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import { importSources } from '@atlaskit/eslint-utils/schema';

import { createLintRuleWithTypedConfig } from '../utils/create-rule-with-typed-config';
import { isSimpleSelector } from '../utils/is-simple-selector';
import { parseSelector } from '../utils/parse-selector';
import { getStyleCalls } from '../utils/style-calls';
import { walkStyleCallProperties } from '../utils/walk-style-call-properties';
import { allowedPseudos } from './constants';
import { lintSelector } from './lint-selector';
import { walkCssMapCall } from './walk-css-map';

const ignoredAtRules: Set<string> = new Set([
	'@container', // ignored because it's covered by `no-container-queries`
	'@media', // ignored because it's covered by `no-nested-styles`
	'@supports',
	'@property',
	'@starting-style',
]);

const canonicalMediaQueries = new Map([
	['media-above-xxs', '@media all'],
	['media-above-xs', '@media (min-width: 30rem)'],
	['media-above-sm', '@media (min-width: 48rem)'],
	['media-above-md', '@media (min-width: 64rem)'],
	['media-above-lg', '@media (min-width: 90rem)'],
	['media-above-xl', '@media (min-width: 110.5rem)'],
	['media-below-xs', '@media not all and (min-width: 30rem)'],
	['media-below-sm', '@media not all and (min-width: 48rem)'],
	['media-below-md', '@media not all and (min-width: 64rem)'],
	['media-below-lg', '@media not all and (min-width: 90rem)'],
	['media-below-xl', '@media not all and (min-width: 110.5rem)'],
	['media-only-xxs', '@media (min-width: 0rem) and (max-width: 29.99rem)'],
	['media-only-xs', '@media (min-width: 30rem) and (max-width: 47.99rem)'],
	['media-only-sm', '@media (min-width: 48rem) and (max-width: 63.99rem)'],
	['media-only-md', '@media (min-width: 64rem) and (max-width: 89.99rem)'],
	['media-only-lg', '@media (min-width: 90rem) and (max-width: 110.49rem)'],
	['media-only-xl', '@media (min-width: 110.5rem)'],
	['media-dark-mode', '@media (prefers-color-scheme: dark)'],
	['media-light-mode', '@media (prefers-color-scheme: light)'],
	['media-reduced-motion', '@media (prefers-reduced-motion: reduce)'],
	['media-reduced-transparency', '@media (prefers-reduced-transparency: reduce)'],
	['media-forced-colors-active', '@media screen and (forced-colors: active)'],
	['media-legacy-high-contrast', '@media screen and (-ms-high-contrast: active)'],
	[
		'media-forced-colors-or-legacy-high-contrast',
		'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)',
	],
]);

type TypeScriptExpression = {
	type: string;
	expression?: TypeScriptExpression;
	typeAnnotation?: {
		type: string;
		typeName?: { type: string; name?: string };
	};
	value?: unknown;
};

const unwrapTypeScriptExpression = (node: TypeScriptExpression): TypeScriptExpression => {
	let expression = node;
	while (
		expression.type === 'TSAsExpression' ||
		expression.type === 'TSTypeAssertion' ||
		expression.type === 'TSNonNullExpression' ||
		expression.type === 'TSSatisfiesExpression'
	) {
		expression = expression.expression as TypeScriptExpression;
	}
	return expression;
};

const isCanonicalTypedMediaKey = (
	node: TypeScriptExpression,
	importedMediaTypes: Map<string, string>,
): boolean => {
	if (node.type !== 'TSSatisfiesExpression') {
		return false;
	}

	const expression = unwrapTypeScriptExpression(node);
	if (expression.type !== 'Literal' || typeof expression.value !== 'string') {
		return false;
	}

	let satisfiesExpression: TypeScriptExpression | undefined = node;
	while (satisfiesExpression?.type === 'TSSatisfiesExpression') {
		const typeName = satisfiesExpression.typeAnnotation?.typeName?.name;
		if (satisfiesExpression.typeAnnotation?.type === 'TSTypeReference' && typeName) {
			const source = importedMediaTypes.get(typeName);
			if (source && canonicalMediaQueries.get(source) === expression.value) {
				return true;
			}
		}
		satisfiesExpression = satisfiesExpression.expression;
	}

	return false;
};

const getImportedMediaTypeSources = (context: Rule.RuleContext): Map<string, string> => {
	const importedMediaTypes = new Map<string, string>();
	for (const statement of getSourceCode(context).ast.body) {
		if (statement.type !== 'ImportDeclaration' || typeof statement.source.value !== 'string') {
			continue;
		}
		const match = statement.source.value.match(/^@atlaskit\/css\/at-rules\/(media-[a-z-]+)$/);
		if (match) {
			for (const specifier of statement.specifiers) {
				if (specifier.type === 'ImportDefaultSpecifier') {
					importedMediaTypes.set(specifier.local.name, match[1]);
				}
			}
		}
	}
	return importedMediaTypes;
};

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
				'Prefix the pseudo-selector with & when it targets this element (for example &:hover); apply descendant styles directly to the child instead.',

			'no-increased-specificity':
				'Replace chained nesting selectors such as && with one & selector, then resolve competing styles through local composition.',

			'no-restricted-pseudos':
				'The {{pseudo}} pseudo-selector is unsupported. Use an allowed local pseudo such as &:hover, or pass explicit state as a prop and select a local cssMap variant.',

			'no-legacy-pseudo-element-syntax':
				'Use a double colon for pseudo-elements, for example &::before or &::after, instead of the legacy single-colon syntax.',

			'no-unparsable-selectors':
				"The selector '{{selectorText}}' could not be parsed. Correct its CSS syntax; if it is valid, report the selector and reproduction to #help-ui-styling-standard.",

			'no-selectors-object':
				'Move selectors out of the selectors object into supported local style keys; apply child styles directly to each child element.',

			/**
			 * At-rule messages
			 */
			'no-keyframes-at-rules':
				'Replace the @keyframes at-rule with keyframes() from @compiled/react and reference its result through animationName.',

			'no-restricted-at-rules':
				'{{atRule}} is unsupported. Use a supported @media, @supports or @property rule; for runtime conditions select a local style variant in JavaScript.',

			'no-grouped-at-rules':
				'Flatten grouped at-rules into complete keys, for example "@media (min-width: 48rem)" instead of an "@media" object containing conditions.',

			'no-noncanonical-media-query':
				'Match the literal query to its imported @atlaskit/css/at-rules type, including the exact breakpoint, units and comparison operator.',

			/**
			 * Suggestion messages
			 */
			'insert-nesting-selector':
				'Insert & before this pseudo-selector to target the element itself, for example &:hover.',
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
				const importedMediaTypes = getImportedMediaTypeSources(context);
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
						const keyType = (key as { type: string }).type;
						if (
							value.type !== 'ObjectExpression' ||
							(keyType !== 'Literal' && keyType !== 'TSSatisfiesExpression')
						) {
							return;
						}

						if (keyType === 'TSSatisfiesExpression') {
							const unwrappedKey = unwrapTypeScriptExpression(key as TypeScriptExpression);
							if (unwrappedKey.type === 'Literal' && typeof unwrappedKey.value === 'string') {
								if (
									unwrappedKey.value.startsWith('@media') &&
									!isCanonicalTypedMediaKey(key as TypeScriptExpression, importedMediaTypes)
								) {
									context.report({ node: key, messageId: 'no-noncanonical-media-query' });
								}
								return;
							}
							return;
						}

						const selectorText = (key as { value: unknown }).value;
						if (typeof selectorText !== 'string') {
							return;
						}
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
