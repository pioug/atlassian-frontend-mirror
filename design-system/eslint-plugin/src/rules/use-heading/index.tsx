import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { getConfig } from './config';
import { NativeElements } from './transformers';

const docsUrl = 'https://atlassian.design/components/heading';

const rule = createLintRule({
	meta: {
		name: 'use-heading',
		type: 'suggestion',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description: 'Encourage the usage of heading components.',
			recommended: false,
			severity: 'warn',
		},
		messages: {
			preferHeading: `This element can be replaced with a "Heading" component. See ${docsUrl} for additional guidance.`,
		},
	},
	create(context) {
		const config = getConfig(context.options[0]);

		return {
			// transforms <h1>...</h1> usages
			'JSXElement[openingElement.name.name=/^h[0-6]$/]': (node: Rule.Node) => {
				return NativeElements.lint(node, { context, config });
			},
		};
	},
});

export default rule;
