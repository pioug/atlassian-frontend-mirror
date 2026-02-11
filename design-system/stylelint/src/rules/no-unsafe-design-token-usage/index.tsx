import valueParser from 'postcss-value-parser';
import stylelint, { type Rule, type RuleBase } from 'stylelint';

import renameMapping from '@atlaskit/tokens/rename-mapping';
import { getCSSCustomProperty } from '@atlaskit/tokens/token-ids';

import { isFunction, isVar, isWord } from '../../utils/rules';
import { getDefaultTokenValue, isToken } from '../../utils/tokens';

type PluginFlags = {
	shouldEnsureFallbackUsage: boolean;
	fallbackUsage: 'forced' | 'optional' | 'none';
};

export const ruleName = 'design-system/no-unsafe-design-token-usage';
export const messages: {
    invalidToken: (name: string | number | boolean | RegExp) => string;
    tokenRemoved: (name: string | number | boolean | RegExp, replacement: string | number | boolean | RegExp) => string;
    missingFallback: string;
    hasFallback: string;
} = stylelint.utils.ruleMessages(ruleName, {
	invalidToken: (name): string =>
		`The token '${name}' does not exist. You can find the design tokens reference at <https://atlaskit.atlassian.com/packages/design-system/tokens/docs/tokens-reference>.`,
	tokenRemoved: (name, replacement): string =>
		`The token '${name}' has been deleted. Please use ${replacement} instead.`,
	missingFallback: 'Token usage is missing a fallback.',
	hasFallback: 'Token usage has a fallback.',
});

const isInvalidToken = (node: valueParser.Node): boolean =>
	isWord(node) && node.value.startsWith('--ds-') && !isToken(node);

const isDeletedToken = (node: valueParser.Node): boolean =>
	isWord(node) &&
	node.value.startsWith('--ds-') &&
	renameMapping
		.filter(({ state }) => state === 'deleted')
		.some((token) => getCSSCustomProperty(token.path) === node.value);

const ruleBase: RuleBase = (isEnabled, flags = {}, context) => {
	return (root, result) => {
		const validOptions = stylelint.utils.validateOptions(
			result,
			ruleName,
			{
				actual: isEnabled,
				possible: [true, false],
			},
			{
				actual: flags,
				possible: {
					shouldEnsureFallbackUsage: [true, false],
					fallbackUsage: ['forced', 'optional', 'none'],
				},
				optional: true,
			},
		);

		if (!validOptions || !isEnabled) {
			return;
		}

		const { shouldEnsureFallbackUsage, fallbackUsage = 'optional' } = flags as PluginFlags;

		let fallbackUsageStrategy = fallbackUsage;

		if (shouldEnsureFallbackUsage) {
			fallbackUsageStrategy = 'forced';
		} else if (shouldEnsureFallbackUsage === false) {
			fallbackUsageStrategy = 'none';
		}

		root.walkDecls((decl) => {
			const parsedValue = valueParser(decl.value);

			parsedValue.walk((node) => {
				if (!isFunction(node) || !isVar(node)) {
					return;
				}

				const [head, ...tail] = node.nodes;
				if (!head) {
					return;
				}

				if (isDeletedToken(head)) {
					const tokenMeta = renameMapping.find(
						({ path }) => getCSSCustomProperty(path) === head.value,
					);

					if (!tokenMeta) {
						return;
					}

					if (tokenMeta.replacement) {
						const replacement = getCSSCustomProperty(tokenMeta.replacement);

						if (context.fix) {
							decl.value = decl.value.replace(head.value, replacement);
							return;
						} else {
							return stylelint.utils.report({
								message: messages.tokenRemoved(head.value, replacement),
								node: decl,
								word: node.value,
								result,
								ruleName,
							});
						}
					}
				}

				if (isInvalidToken(head)) {
					return stylelint.utils.report({
						message: messages.invalidToken(head.value),
						node: decl,
						word: node.value,
						result,
						ruleName,
					});
				}

				const isTokenUsage = isToken(head);
				if (!isTokenUsage) {
					return;
				}

				const hasFallback = tail.some((node) => !isToken(node));

				if (
					fallbackUsageStrategy === 'optional' ||
					(fallbackUsageStrategy === 'forced' && hasFallback) ||
					(fallbackUsageStrategy === 'none' && !hasFallback)
				) {
					return;
				}

				if (context.fix && !hasFallback) {
					const defaultFallback = getDefaultTokenValue(head);
					if (defaultFallback) {
						decl.value = decl.value.replace(head.value, `${head.value}, ${defaultFallback}`);
						return;
					}
				}

				stylelint.utils.report({
					message: hasFallback ? messages.hasFallback : messages.missingFallback,
					node: decl,
					word: node.value,
					result,
					ruleName,
				});
			});
		});
	};
};

const rule: Rule<any, any> = Object.assign(ruleBase, {
	ruleName: ruleName,
	messages: messages,
});

const plugin: stylelint.Plugin = stylelint.createPlugin(ruleName, rule);

export default plugin;
