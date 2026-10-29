import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { JSXElement } from './node-types/jsx-element';
import { StyledComponent } from './node-types/styled-component';

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
			noHtmlButton:
				'Replace this {{ name }} with Button from @atlaskit/button/default/button, or named Pressable from @atlaskit/primitives/compiled/pressable for a custom button. Preserve its intended type, handlers and accessible name.',
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
