import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { ImportDeclaration } from './linters';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'use-spotlight-package',
		type: 'problem',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description: 'Discourage the use of @atlaskit/onboarding in favor of @atlaskit/spotlight.',
			recommended: false,
			severity: 'warn',
		},
		messages: {
			['use-spotlight-package']:
				'@atlaskit/onboarding is deprecated in favor of @atlaskit/spotlight. Please migrate your spotlight experiences accordingly.',
		},
	},
	create(context) {
		return {
			'ImportDeclaration[source.value="@atlaskit/onboarding"]': (node: Rule.Node) =>
				ImportDeclaration.lint(node, { context }),
		};
	},
});

export default rule;
