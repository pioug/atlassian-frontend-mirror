import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

export const name = 'no-to-match-snapshot';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name,
		type: 'problem',
		docs: {
			description:
				'Disallow using toMatchSnapshot() in favor of toMatchInlineSnapshot(). See https://hello.atlassian.net/wiki/spaces/DST/pages/6105892000/DSTRFC-038+-+Removal+of+.toMatchSnapshot for rationale.',
			recommended: false,
			severity: 'error',
		},
		messages: {
			useInlineSnapshot:
				'Use toMatchInlineSnapshot() instead of toMatchSnapshot(). See https://hello.atlassian.net/wiki/spaces/DST/pages/6105892000/DSTRFC-038+-+Removal+of+.toMatchSnapshot for rationale.',
		},
	},
	create(context: Rule.RuleContext) {
		return {
			MemberExpression(node) {
				// Check if this is a call to toMatchSnapshot
				if (
					!isNodeOfType(node.property, 'Identifier') ||
					node.property.name !== 'toMatchSnapshot'
				) {
					return;
				}

				// Check if the object is an expect() call
				if (
					!isNodeOfType(node.object, 'CallExpression') ||
					!isNodeOfType(node.object.callee, 'Identifier') ||
					node.object.callee.name !== 'expect'
				) {
					return;
				}

				// Only report if this is being called (i.e., it's part of a CallExpression)
				// We want to catch expect(...).toMatchSnapshot() but not just the property access
				if (!node.parent || !isNodeOfType(node.parent, 'CallExpression')) {
					return;
				}

				context.report({
					node: node.property,
					messageId: 'useInlineSnapshot',
				});
			},
		};
	},
});

export default rule;
