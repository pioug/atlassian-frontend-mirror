import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { JSXElement } from './node-types/jsx-element';
import { StyledComponent } from './node-types/styled-component';

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
			noHtmlTextarea:
				'Replace <{{ name }}> with Textarea from @atlaskit/textarea/text-area. Preserve the field name, value, change handler and label association; use the supported sizing props for its intended height.',
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
