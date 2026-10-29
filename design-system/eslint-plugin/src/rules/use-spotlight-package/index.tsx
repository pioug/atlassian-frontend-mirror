import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { ImportDeclaration } from './linters/import-declaration';

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
				'Migrate @atlaskit/onboarding experiences to the composable @atlaskit/spotlight entrypoints. Follow platform/packages/design-system/spotlight/examples/single-step.tsx for provider, target, content and dismissal wiring.',
		},
	},
	create(context) {
		return {
			ImportDeclaration: (node: Rule.Node) => ImportDeclaration.lint(node, { context }),
		};
	},
});

export default rule;
