import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-atlaskit-theme',
		docs: {
			description: 'Disallow imports from `@atlaskit/theme`',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			'no-atlaskit-theme':
				'Do not import `@atlaskit/theme`. Use `@atlaskit/tokens` or Atlassian Design System components instead.',
		},
		type: 'problem',
	},
	create(context) {
		return {
			// esquery regexes cannot contain a raw `/`, so the path separator is `\x2F`.
			// Unanchored at the end, so this matches `@atlaskit/theme` and any subpath.
			'ImportDeclaration[source.value=/^@atlaskit\\x2Ftheme(\\x2F|$)/]'(node: Rule.Node) {
				context.report({
					node,
					messageId: 'no-atlaskit-theme',
				});
			},
		};
	},
});

export default rule;
