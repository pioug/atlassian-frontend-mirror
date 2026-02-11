import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { JSXElement, StyledComponent } from './node-types';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-html-button',
		type: 'suggestion',
		docs: {
			description:
				'Discourage direct usage of HTML button elements in favor of Atlassian Design System button components.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noHtmlButton: `This {{ name }} should be replaced with a button component from the Atlassian Design System, such as the "Button" component when suitable. For custom buttons use the "Pressable" primitive. ADS buttons include event tracking, ensure accessible implementations, and provide access to ADS styling features like design tokens.`,
		},
	},
	create(context) {
		return {
			// transforms styled.<button>(...) usages
			CallExpression(node: Rule.Node) {
				StyledComponent.lint(node, { context });
			},

			// transforms <button css={...}> usages
			JSXElement(node: Rule.Node) {
				JSXElement.lint(node, { context });
			},
		};
	},
});

export default rule;
