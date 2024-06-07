import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { StyleProperty } from './transformers';

const rule = createLintRule({
	meta: {
		name: 'use-tokens-space',
		type: 'problem',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description: 'Enforces usage of space design tokens rather than hard-coded values.',
			recommended: false,
			severity: 'error',
		},
		messages: {
			noRawSpacingValues:
				'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.',
		},
	},
	create(context) {
		return {
			'CallExpression[callee.name="css"] ObjectExpression Property': (node: Rule.Node) =>
				StyleProperty.lint(node, { context }),
			'CallExpression[callee.name="keyframes"] ObjectExpression Property': (node: Rule.Node) =>
				StyleProperty.lint(node, { context }),
			'CallExpression[callee.name="cssMap"] ObjectExpression Property': (node: Rule.Node) =>
				StyleProperty.lint(node, { context }),
			'CallExpression[callee.object.name=styled] ObjectExpression Property': (node: Rule.Node) =>
				StyleProperty.lint(node, { context }),
			'CallExpression[callee.object.name=styled2] ObjectExpression Property': (node: Rule.Node) =>
				StyleProperty.lint(node, { context }),
		};
	},
});

export default rule;
