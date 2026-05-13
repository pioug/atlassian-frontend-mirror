import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';

import { JSXElement } from './node-types/jsx-element';
import { StyledComponent } from './node-types/styled-component';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-html-code',
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			description:
				'Discourage direct usage of HTML code elements in favor of the Atlassian Design System code component.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noHtmlCode: `This <{{ name }}> should be replaced with the code component from the Atlassian Design System. The ADS code component ensures accessible implementations and consistent ADS styling.`,
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
