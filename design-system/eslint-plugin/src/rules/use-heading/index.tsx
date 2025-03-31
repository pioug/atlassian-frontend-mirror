import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';
import { errorBoundary } from '../utils/error-boundary';

import { getConfig, type RuleConfig } from './config';
import { NativeElements } from './transformers';

const docsUrl = 'https://atlassian.design/components/heading';

const rule = createLintRule({
	meta: {
		name: 'use-heading',
		type: 'suggestion',
		fixable: 'code',
		hasSuggestions: true,
		schema: [
			{
				type: 'object',
				properties: {
					enableUnsafeReport: {
						type: 'boolean',
					},
					enableUnsafeAutofix: {
						type: 'boolean',
					},
				},
				additionalProperties: false,
			},
		],
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
		// TODO: JFP-2823 - this type cast was added due to Jira's ESLint v9 migration
		const config = getConfig(context.options[0] as unknown as Partial<RuleConfig>);

		return errorBoundary(
			{
				// transforms <h1>...</h1> usages
				'JSXElement[openingElement.name.name=/^h[0-6]$/]': (node: Rule.Node) => {
					return NativeElements.lint(node, { context, config });
				},
			},
			config,
		);
	},
});

export default rule;
