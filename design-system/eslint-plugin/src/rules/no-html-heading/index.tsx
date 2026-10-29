import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { JSXElement } from './node-types/jsx-element';
import { StyledComponent } from './node-types/styled-component';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-html-heading',
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			description:
				'Discourage direct usage of HTML heading elements in favor of Atlassian Design System heading components.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noHtmlHeading:
				'Replace <{{ name }}> with Heading from @atlaskit/heading/heading. Preserve the semantic h1-h6 level with as, and choose size separately for the intended visual hierarchy.',
		},
	},
	create(context) {
		return {
			// transforms styled.<heading>(...) usages
			CallExpression(node: Rule.Node) {
				StyledComponent.lint(node, { context });
			},

			// transforms <heading css={...}> usages
			JSXElement(node: Rule.Node) {
				JSXElement.lint(node, { context });
			},
		};
	},
});

export default rule;
