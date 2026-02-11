import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { JSXElement, StyledComponent } from './node-types';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-html-select',
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			description:
				'Discourage direct usage of HTML select elements in favor of the Atlassian Design System select component.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noHtmlSelect: `This <{{ name }}> should be replaced with the select component from the Atlassian Design System. ADS select components have event tracking, ensure accessible implementations, and provide access to ADS styling features like design tokens.`,
		},
	},
	create(context) {
		return {
			// transforms styled.<anchor>(...) usages
			CallExpression(node: Rule.Node) {
				StyledComponent.lint(node, { context });
			},

			// transforms <anchor css={...}> usages
			JSXElement(node: Rule.Node) {
				JSXElement.lint(node, { context });
			},
		};
	},
});

export default rule;
