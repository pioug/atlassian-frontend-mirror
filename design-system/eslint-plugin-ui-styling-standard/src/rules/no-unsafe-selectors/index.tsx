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

			'no-noncanonical-media-query':
				'Use the exact media query represented by the imported @atlaskit/css/at-rules type.',

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
