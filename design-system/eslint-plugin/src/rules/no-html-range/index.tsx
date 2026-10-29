import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { JSXElement } from './node-types/jsx-element';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-html-range',
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			description:
				'Discourage direct usage of HTML range elements in favor of the Atlassian Design System range component.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noHtmlRange:
				'Replace <{{ name }}> with Range from @atlaskit/range/range. Preserve min, max, step and the label association; adapt onChange to receive the numeric value rather than a native event.',
		},
	},
	create(context) {
		return {
			// transforms <input type="range" css={...}> usages
			JSXElement(node: Rule.Node) {
				JSXElement.lint(node, { context });
			},
		};
	},
});

export default rule;
