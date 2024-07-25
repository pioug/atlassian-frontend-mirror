import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { JSXElement, StyledComponent } from './node-types';

const rule = createLintRule({
	meta: {
		name: 'no-html-anchor',
		type: 'suggestion',
		docs: {
			description:
				'Discourage direct usage of HTML anchor elements in favor of Atlassian Design System link components.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noHtmlAnchor: `This <{{ name }}> should be replaced with a link component from the Atlassian Design System, such as the "Link" or "LinkButton" component when suitable. For custom links use the "Anchor" primitive. ADS links include event tracking, automatic router configuration, ensure accessible implementations, and provide access to ADS styling features like design tokens.`,
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
