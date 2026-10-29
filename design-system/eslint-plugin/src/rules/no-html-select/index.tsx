import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { JSXElement } from './node-types/jsx-element';
import { StyledComponent } from './node-types/styled-component';

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
			noHtmlSelect:
				'Replace <{{ name }}> with Select from @atlaskit/select/default. Convert option children to the options prop, adapt value/onChange to option objects, and associate the label through inputId.',
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
