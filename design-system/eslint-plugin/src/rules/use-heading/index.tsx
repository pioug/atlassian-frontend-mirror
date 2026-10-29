import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { errorBoundary } from '../utils/error-boundary';
import { getConfig, type RuleConfig } from './config';
import { NativeElements } from './transformers/native-elements';

const docsUrl = 'https://atlassian.design/components/heading';

const rule: Rule.RuleModule = createLintRule({
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
			recommended: true,
			severity: 'warn',
		},
		messages: {
			preferHeading: `Use Heading from @atlaskit/heading/heading, choosing size for appearance and as for the intended h1-h6 semantics. See ${docsUrl} for supported props.`,
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
