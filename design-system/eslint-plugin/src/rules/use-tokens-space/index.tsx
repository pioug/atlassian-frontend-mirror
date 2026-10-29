import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { StyleProperty } from './transformers/style-property';

const rule: Rule.RuleModule = createLintRule({
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
				"Replace raw spacing with an appropriate space.* token from @atlaskit/tokens, for example token('space.100'), or use a compiled layout primitive's gap/padding API.",
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
