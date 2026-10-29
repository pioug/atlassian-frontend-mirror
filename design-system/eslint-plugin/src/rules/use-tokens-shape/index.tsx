import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { StyleProperty } from './transformers';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'use-tokens-shape',
		type: 'problem',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description: 'Enforces usage of shape design tokens rather than hard-coded values.',
			recommended: false,
			severity: 'error',
		},
		messages: {
			noRawShapeValues:
				'Replace raw radius/border-width values with token() from @atlaskit/tokens, choosing radius.* or the border.width family for the intended shape.',
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
