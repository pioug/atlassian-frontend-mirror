import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { JSXElement } from './node-types';

const rule = createLintRule({
	meta: {
		name: 'no-html-radio',
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			description:
				'Discourage direct usage of HTML radio elements in favor of the Atlassian Design System radio component.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noHtmlRadio: `This <{{ name }}> should be replaced with a radio component from the Atlassian Design System. ADS components include event tracking, ensure accessible implementations, and provide access to ADS styling features like design tokens.`,
		},
	},
	create(context) {
		return {
			// transforms <input type="radio" css={...}> usages
			JSXElement(node: Rule.Node) {
				JSXElement.lint(node, { context });
			},
		};
	},
});

export default rule;
