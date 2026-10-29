import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { JSXElement } from './node-types/jsx-element';

const rule: Rule.RuleModule = createLintRule({
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
			noHtmlRadio:
				'Replace <{{ name }}> with Radio from @atlaskit/radio/radio. Map checked and disabled to isChecked and isDisabled, and preserve the group name, value, label and change behavior.',
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
