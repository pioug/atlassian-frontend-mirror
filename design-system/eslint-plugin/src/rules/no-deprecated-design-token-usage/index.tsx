// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';

import renameMapping from '@atlaskit/tokens/rename-mapping';
import { getTokenId } from '@atlaskit/tokens/token-ids';

import { createLintRule } from '../utils/create-rule';

const rule = createLintRule({
	meta: {
		name: 'no-deprecated-design-token-usage',
		docs: {
			description: 'Disallow using deprecated design tokens.',
			recommended: true,
			severity: 'warn',
		},
		fixable: 'code',
		type: 'problem',
		messages: {
			tokenDeprecated:
				'The token "{{name}}" is deprecated, Please refer to the changelog for guidance on how to migrate. https://atlassian.design/components/tokens/changelog',
			tokenRenamed: 'The token "{{name}}" is deprecated in favour of "{{replacement}}".',
		},
	},
	create(context) {
		return {
			'CallExpression[callee.name="token"]': (node: Rule.Node) => {
				if (node.type !== 'CallExpression') {
					return;
				}

				if (node.arguments[0].type !== 'Literal') {
					return;
				}

				const tokenKey = node.arguments[0].value;

				if (!tokenKey) {
					return;
				}

				if (typeof tokenKey !== 'string') {
					return;
				}

				const migrationMeta = renameMapping
					.filter((t) => t.state === 'deprecated')
					.find((t) => getTokenId(t.path) === tokenKey);

				if (!migrationMeta) {
					return;
				}

				if (migrationMeta.replacement) {
					// Replacement specified, apply fixer
					const replacement = getTokenId(migrationMeta.replacement);

					context.report({
						messageId: 'tokenRenamed',
						node,
						data: {
							name: tokenKey,
							replacement,
						},
						fix: (fixer) => fixer.replaceText(node.arguments[0], `'${replacement}'`),
					});
					return;
				}

				// No replacement specified
				if (migrationMeta.state === 'deprecated' && !migrationMeta.replacement) {
					context.report({
						messageId: 'tokenDeprecated',
						node,
						data: { name: tokenKey },
					});

					return;
				}
			},
		};
	},
});

export default rule;
