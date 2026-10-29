import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { JSXElement } from './node-types/jsx-element';
import { StyledComponent } from './node-types/styled-component';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-html-image',
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			description:
				'Discourage direct usage of HTML image elements in favor of the Atlassian Design System image component.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noHtmlImage:
				'Replace <{{ name }}> with Image from @atlaskit/image/image. Preserve its source, dimensions and meaningful alt text; retain alt="" when the image is decorative.',
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
