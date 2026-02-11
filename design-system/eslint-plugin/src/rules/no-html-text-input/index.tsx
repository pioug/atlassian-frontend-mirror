import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { JSXElement } from './node-types';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-html-text-input',
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			description:
				'Discourage direct usage of HTML text input elements in favor of the Atlassian Design System textfield component.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noHtmlTextInput: `This <{{ name }}> should be replaced with a textfield component from the Atlassian Design System. ADS components include event tracking, ensure accessible implementations, and provide access to ADS styling features like design tokens.`,
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
