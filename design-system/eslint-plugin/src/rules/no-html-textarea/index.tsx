import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { JSXElement, StyledComponent } from './node-types';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-html-textarea',
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			description:
				'Discourage direct usage of HTML textarea elements in favor of the Atlassian Design System textarea component.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noHtmlTextarea: `This <{{ name }}> should be replaced with a textarea component from the Atlassian Design System. ADS components include event tracking, ensure accessible implementations, and provide access to ADS styling features like design tokens.`,
		},
	},
	create(context) {
		return {
			// transforms styled.<textarea>(...) usages
			CallExpression(node: Rule.Node) {
				StyledComponent.lint(node, { context });
			},

			// transforms <textarea css={...}> usages
			JSXElement(node: Rule.Node) {
				JSXElement.lint(node, { context });
			},
		};
	},
});

export default rule;
