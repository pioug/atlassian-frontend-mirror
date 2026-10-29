import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { JSXElement } from './node-types/jsx-element';

const rule: Rule.RuleModule = createLintRule({
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
			noHtmlCheckbox:
				'Replace <{{ name }}> with Checkbox from @atlaskit/checkbox/checkbox. Map checked and disabled to isChecked and isDisabled, and preserve its label, name, value and change behavior.',
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
