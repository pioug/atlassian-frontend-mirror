import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { JSXElement, StyledComponent } from './node-types';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-html-image',
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			description:
				'Discourage direct usage of HTML image elements in favor of the Atlassian Design System image component.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noHtmlImage: `This <{{ name }}> should be replaced with the image component from the Atlassian Design System. ADS images ensure accessible implementations, and provide access to ADS styling features like design tokens.`,
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
