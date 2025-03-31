// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import renameMapping from '@atlaskit/tokens/rename-mapping';
import tokenDefaultValues from '@atlaskit/tokens/token-default-values';
import { getTokenId } from '@atlaskit/tokens/token-ids';
import tokens from '@atlaskit/tokens/token-names';

import { createLintRule } from '../utils/create-rule';
import { isDecendantOfStyleBlock, isDecendantOfStyleJsxAttribute } from '../utils/is-node';
import { isToken } from '../utils/is-token';

type PluginConfig = {
	shouldEnforceFallbacks: boolean;
	fallbackUsage: 'forced' | 'optional' | 'none';
	/**
	 * List of additional tokens that can be configured for the rule to accept.
	 * Provided as a workaround for teams who need custom tokens for migration purposes.
	 *
	 * Warning: tokens provided here will not trigger warnings, even if deprecated or deleted.
	 * Do not pass in the names of tokens from the @atlaskit/tokens package.
	 */
	UNSAFE_ignoreTokens?: string[];
};

const rule = createLintRule({
	meta: {
		name: 'no-unsafe-design-token-usage',
		docs: {
			description: 'Enforces design token usage is statically and locally analyzable.',
			recommended: true,
			severity: 'error',
		},
		fixable: 'code',
		type: 'problem',
		messages: {
			directTokenUsage: `Access the global theme using the token function.

\`\`\`
import { token } from '@atlaskit/tokens';

token('{{tokenKey}}');
\`\`\`
`,
			staticToken: `Token string should be inlined directly into the function call.

\`\`\`
token('color.background.blanket');
\`\`\`
`,
			invalidToken: 'The token "{{name}}" does not exist.',
			tokenRemoved: 'The token "{{name}}" is removed in favour of "{{replacement}}".',
			tokenIsExperimental:
				'The token "{{name}}" is experimental and should not be used directly at this time. It should be replaced by "{{replacement}}".',
			tokenFallbackEnforced: `Token function requires a fallback, preferably something that best matches the light/default theme in case tokens aren't present.

\`\`\`
token('color.background.blanket', N500A);
\`\`\`
      `,
			tokenFallbackRestricted: `Token function must not use a fallback.

\`\`\`
token('color.background.blanket');
\`\`\`
      `,
		},
		schema: [
			{
				type: 'object',
				properties: {
					shouldEnforceFallbacks: {
						type: 'boolean',
					},
					fallbackUsage: {
						enum: ['forced', 'optional', 'none'],
					},
					UNSAFE_ignoreTokens: {
						type: 'array',
						items: {
							type: 'string',
						},
					},
				},
			},
		],
	},
	create(context) {
		// TODO: JFP-2823 - this type cast was added due to Jira's ESLint v9 migration
		const config: PluginConfig = { ...(context.options[0] as unknown as PluginConfig) };

		if (!config.fallbackUsage) {
			config.fallbackUsage = config.shouldEnforceFallbacks ? 'forced' : 'none';
		}

		const UNSAFE_ignoreTokens = new Set(config.UNSAFE_ignoreTokens);

		return {
			'TaggedTemplateExpression[tag.name="css"],TaggedTemplateExpression[tag.object.name="styled"]':
				(node: Rule.Node) => {
					if (!isNodeOfType(node, 'TaggedTemplateExpression')) {
						return;
					}

					const value = node.quasi.quasis.map((q) => q.value.raw).join('');
					const tokenKey = isToken(value, tokens);

					if (tokenKey) {
						context.report({
							messageId: 'directTokenUsage',
							node,
							data: { tokenKey },
						});
						return;
					}
				},

			'ObjectExpression > Property > Literal': (node: Rule.Node) => {
				if (node.type !== 'Literal') {
					return;
				}

				if (typeof node.value !== 'string') {
					return;
				}

				if (!isDecendantOfStyleBlock(node) && !isDecendantOfStyleJsxAttribute(node)) {
					return;
				}

				const tokenKey = isToken(node.value, tokens);
				const isCSSVar = node.value.startsWith('var(');

				if (tokenKey) {
					context.report({
						messageId: 'directTokenUsage',
						node,
						data: { tokenKey },
						fix: (fixer) => (isCSSVar ? fixer.replaceText(node, `token('${tokenKey}')`) : null),
					});
					return;
				}
			},

			'CallExpression:matches([callee.name="token"], [callee.name="getTokenValue"])': (
				node: Rule.Node,
			) => {
				if (!isNodeOfType(node, 'CallExpression')) {
					return;
				}

				const isGetTokenValueCall =
					isNodeOfType(node.callee, 'Identifier') && node.callee.name === 'getTokenValue';

				// Skip processing if it's a `getTokenValue` call and config.fallbackUsage is `none`
				if (isGetTokenValueCall && config.fallbackUsage === 'none') {
					return;
				}

				if (node.arguments.length < 2 && config.fallbackUsage === 'forced') {
					let fix: Rule.ReportFixer | undefined;

					if (node.arguments[0].type === 'Literal') {
						const { value } = node.arguments[0];
						const tokenName = value as keyof typeof tokenDefaultValues;
						const fallbackValue = tokenDefaultValues[tokenName] || null;

						if (fallbackValue) {
							fix = (fixer: Rule.RuleFixer) =>
								fixer.replaceText(
									node,
									`${isNodeOfType(node.callee, 'Identifier') ? node.callee.name : 'token'}('${tokenName}', '${fallbackValue}')`,
								);
						}
					}

					context.report({
						messageId: 'tokenFallbackEnforced',
						node,
						fix,
					});
				} else if (node.arguments.length > 1 && config.fallbackUsage === 'none') {
					if (node.arguments[0].type === 'Literal') {
						const { value } = node.arguments[0];
						context.report({
							messageId: 'tokenFallbackRestricted',
							node: node.arguments[1],
							fix: (fixer: Rule.RuleFixer) =>
								fixer.replaceText(
									node,
									`${
										isNodeOfType(node.callee, 'Identifier') ? node.callee.name : 'token'
									}('${value}')`,
								),
						});
					} else {
						context.report({
							messageId: 'tokenFallbackRestricted',
							node: node.arguments[1],
						});
					}
				}

				if (node.arguments[0] && node.arguments[0].type !== 'Literal') {
					context.report({ messageId: 'staticToken', node });
					return;
				}

				const tokenKey = node.arguments[0].value;

				if (!tokenKey) {
					return;
				}

				const deletedMigrationMeta = renameMapping
					.filter((t) => t.state === 'deleted')
					.find((t) => getTokenId(t.path) === tokenKey);

				if (
					typeof tokenKey === 'string' &&
					deletedMigrationMeta &&
					deletedMigrationMeta.replacement
				) {
					const cleanTokenKey = getTokenId(deletedMigrationMeta.replacement);

					context.report({
						messageId: 'tokenRemoved',
						node,
						data: {
							name: tokenKey,
							replacement: cleanTokenKey,
						},
						fix: (fixer) => fixer.replaceText(node.arguments[0], `'${cleanTokenKey}'`),
					});
					return;
				}

				const tokenMeta = renameMapping
					.filter((t) => t.state === 'experimental')
					.find((t) => getTokenId(t.path) === tokenKey);

				const tokenNames = Object.keys(tokens);

				if (typeof tokenKey === 'string' && tokenMeta && tokenMeta.replacement) {
					const replacementValue = tokenMeta.replacement;
					const isReplacementAToken = tokenNames.includes(replacementValue);

					context.report({
						messageId: 'tokenIsExperimental',
						node,
						data: {
							name: tokenKey,
							replacement: replacementValue,
						},
						fix: (fixer) =>
							isReplacementAToken
								? fixer.replaceText(node.arguments[0], `'${replacementValue}'`)
								: fixer.replaceText(node, `'${replacementValue}'`),
					});
					return;
				}

				if (
					typeof tokenKey !== 'string' ||
					(typeof tokenKey === 'string' &&
						!tokens[tokenKey as keyof typeof tokens] &&
						!UNSAFE_ignoreTokens.has(tokenKey))
				) {
					context.report({
						messageId: 'invalidToken',
						node,
						data: {
							name: tokenKey.toString(),
						},
					});
					return;
				}
			},
		};
	},
});

export default rule;
