import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { JSXElement } from './node-types';

const rule = createLintRule({
	meta: {
		name: 'no-html-checkbox',
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			description:
				'Discourage direct usage of HTML checkbox elements in favor of the Atlassian Design System checkbox component.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noHtmlCheckbox: `This <{{ name }}> should be replaced with a checkbox component from the Atlassian Design System. ADS components include event tracking, ensure accessible implementations, and provide access to ADS styling features like design tokens.`,
		},
	},
	create(context) {
		return {
			// transforms <input type="checkbox" css={...}> usages
			JSXElement(node: Rule.Node) {
				JSXElement.lint(node, { context });
			},
		};
	},
});

export default rule;
