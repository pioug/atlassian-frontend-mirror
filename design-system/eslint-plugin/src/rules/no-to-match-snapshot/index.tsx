import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-lint-rule';

export const name = 'no-to-match-snapshot';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name,
		type: 'problem',
		docs: {
			description:
				'Disallow using toMatchSnapshot() and toMatchInlineSnapshot() in unit tests. Snapshot assertions should be replaced with explicit assertions.',
			recommended: false,
			severity: 'error',
		},
		messages: {
			avoidSnapshots:
				'Avoid snapshot matchers in unit tests. Replace toMatchSnapshot()/toMatchInlineSnapshot() with explicit assertions.',
		},
	},
	create(context: Rule.RuleContext) {
		const snapshotMatchers = new Set(['toMatchSnapshot', 'toMatchInlineSnapshot']);

		const getStaticString = (node: any): string | null => {
			if (!node) {
				return null;
			}
			if (node.type === 'Literal' && typeof node.value === 'string') {
				return node.value;
			}
			if (node.type === 'BinaryExpression' && node.operator === '+') {
				const left = getStaticString(node.left);
				const right = getStaticString(node.right);
				return left !== null && right !== null ? left + right : null;
			}
			return null;
		};

		const isExpectCall = (node: any): boolean =>
			isNodeOfType(node, 'CallExpression') &&
			isNodeOfType(node.callee, 'Identifier') &&
			node.callee.name === 'expect';

		return {
			CallExpression(node) {
				// Handle expect(x).toMatchSnapshot() and expect(x).toMatchInlineSnapshot()
				if (
					isNodeOfType(node.callee, 'MemberExpression') &&
					!node.callee.computed &&
					isNodeOfType(node.callee.property, 'Identifier') &&
					isExpectCall(node.callee.object) &&
					snapshotMatchers.has(node.callee.property.name)
				) {
					context.report({
						node: node.callee.property,
						messageId: 'avoidSnapshots',
					});
				}

				// Handle expect(x)['toMatch' + 'Snapshot']() / ['toMatch' + 'InlineSnapshot']
				if (
					isNodeOfType(node.callee, 'MemberExpression') &&
					node.callee.computed &&
					isExpectCall(node.callee.object)
				) {
					const prop = getStaticString(node.callee.property);
					if (prop && snapshotMatchers.has(prop)) {
						context.report({
							node: node.callee.property,
							messageId: 'avoidSnapshots',
						});
					}
				}
			},
		};
	},
});

export default rule;
