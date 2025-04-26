import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { JSXElement, StyledComponent } from './node-types';

const rule = createLintRule({
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
			noHtmlHeading: `This <{{ name }}> should be replaced with a heading component from the Atlassian Design System. ADS headings include ensure accessible implementations and provide access to ADS styling features like design tokens.`,
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
