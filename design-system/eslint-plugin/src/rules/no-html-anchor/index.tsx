import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { JSXElement } from './node-types/jsx-element';
import { StyledComponent } from './node-types/styled-component';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-html-anchor',
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			description:
				'Discourage direct usage of HTML anchor elements in favor of Atlassian Design System link components.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noHtmlAnchor:
				'Replace <{{ name }}> with Link from @atlaskit/link/link, or named Anchor from @atlaskit/primitives/compiled/anchor for a custom link. Preserve href, navigation behavior and link text.',
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
