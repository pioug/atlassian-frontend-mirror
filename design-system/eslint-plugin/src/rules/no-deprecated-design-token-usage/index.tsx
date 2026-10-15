import type { Rule } from 'eslint';

import renameMapping from '@atlaskit/tokens/rename-mapping';
import tokens from '@atlaskit/tokens/token-names';
import { getTokenId } from '@atlaskit/tokens/utils/get-token-id';

import { createLintRule } from '../utils/create-lint-rule';
import { getPrimitiveTokenUsage } from '../utils/get-primitive-token-usage';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-deprecated-design-token-usage',
		docs: {
			description: 'Disallow using deprecated design tokens.',
			recommended: true,
			severity: 'warn',
		},
		hasSuggestions: true,
		type: 'problem',
		messages: {
			tokenDeprecated:
				'The token "{{name}}" is deprecated, Please refer to the changelog for guidance on how to migrate. https://atlassian.design/components/tokens/changelog',
			tokenRenamed: 'The token "{{name}}" is deprecated in favour of "{{replacement}}".',
		},
	},
	create(context) {
		const deprecatedTokens = new Map(
			renameMapping.filter((t) => t.state === 'deprecated').map((t) => [getTokenId(t.path), t]),
		);
		const reportDeprecation = (
			tokenKey: string,
			node: Rule.Node,
			argument: Rule.Node,
			getReplacementValue?: (name: string) => string | undefined,
		) => {
			const migrationMeta = deprecatedTokens.get(tokenKey);
			if (!migrationMeta) {
				return;
			}

			if (migrationMeta.replacement) {
				const replacement = getTokenId(migrationMeta.replacement);
				const value = getReplacementValue
					? replacement in tokens
						? getReplacementValue(replacement)
						: undefined
					: replacement;
				context.report({
					messageId: 'tokenRenamed',
					node,
					data: { name: tokenKey, replacement },
					suggest: value
						? [
								{
									desc: `Replace with '${value}'`,
									fix: (fixer) => fixer.replaceText(argument, `'${value}'`),
								},
							]
						: undefined,
				});
			} else {
				context.report({
					messageId: 'tokenDeprecated',
					node,
					data: { name: tokenKey },
				});
			}
		};

		return {
			JSXAttribute: (node: Rule.Node) => {
				const usage = getPrimitiveTokenUsage(node, context);
				if (usage) {
					reportDeprecation(usage.tokenName, usage.node, usage.node, usage.getReplacementValue);
				}
			},
			'CallExpression[callee.name="token"]': (node: Rule.Node) => {
				if (node.type !== 'CallExpression' || node.arguments[0]?.type !== 'Literal') {
					return;
				}
				const tokenKey = node.arguments[0].value;
				if (typeof tokenKey === 'string') {
					reportDeprecation(tokenKey, node, node.arguments[0] as Rule.Node);
				}
			},
		};
	},
});

export default rule;
