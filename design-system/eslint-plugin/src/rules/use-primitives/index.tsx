import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { getConfig, type RuleConfig, VALID_PATTERNS } from './config';
import { CompiledStyled, EmotionCSS } from './transformers';

const boxDocsUrl = 'https://atlassian.design/components/primitives/box';

const rule = createLintRule({
	meta: {
		name: 'use-primitives',
		type: 'suggestion',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description: 'Encourage the usage of primitives components.',
			recommended: false,
			severity: 'warn',
		},
		schema: [
			{
				type: 'object',
				properties: {
					patterns: {
						type: 'array',
						maxLength: VALID_PATTERNS.length,
						items: {
							type: 'string',
							enum: VALID_PATTERNS,
						},
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			preferPrimitivesBox: `This element can be replaced with a "Box" primitive. See ${boxDocsUrl} for additional guidance.`,
		},
	},
	create(context) {
		// TODO: JFP-2823 - this type cast was added due to Jira's ESLint v9 migration
		const config = getConfig(context.options[0] as unknown as Partial<RuleConfig>);

		return {
			// transforms styled.<html>(...) usages
			CallExpression(node: Rule.Node) {
				CompiledStyled.lint(node, { context, config });
			},

			// transforms <div css={...}> usages
			JSXElement(node: Rule.Node) {
				EmotionCSS.lint(node, { context, config });
			},
		};
	},
});

export default rule;
