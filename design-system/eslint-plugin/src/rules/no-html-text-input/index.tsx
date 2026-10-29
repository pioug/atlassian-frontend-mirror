import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { JSXElement } from './node-types/jsx-element';

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
			noHtmlTextInput:
				'Replace <{{ name }}> with Textfield from @atlaskit/textfield/text-field. Preserve type, name, id, value and handlers, and associate its visible label with the same id.',
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
