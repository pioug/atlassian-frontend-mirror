import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';
import { errorBoundary } from '../utils/error-boundary';

import { getConfig, PATTERNS } from './config';
import { EmphasisElements, ParagraphElements, SpanElements, StrongElements } from './transformers';

const textDocsUrl = 'https://atlassian.design/components/primitives/text';

const rule = createLintRule({
	meta: {
		name: 'use-primitives-text',
		type: 'suggestion',
		fixable: 'code',
		hasSuggestions: true,
		schema: [
			{
				type: 'object',
				properties: {
					failSilently: {
						type: 'boolean',
					},
					inheritColor: {
						type: 'boolean',
					},
					enableUnsafeAutofix: {
						type: 'boolean',
					},
					enableUnsafeReport: {
						type: 'boolean',
					},
					patterns: {
						maxLength: PATTERNS.length,
						type: 'array',
						items: {
							type: 'string',
							enum: PATTERNS,
						},
						uniqueItems: true,
					},
				},
				additionalProperties: false,
			},
		],
		docs: {
			description: 'Encourage the usage of text components.',
			recommended: false,
			severity: 'warn',
		},
		messages: {
			preferPrimitivesText: `This element can be replaced with a "Text" primitive. See ${textDocsUrl} for additional guidance.`,
			preferPrimitivesStackedText: `These paragraphs can be replaced with a "Text" and "Stack" primitives. See ${textDocsUrl} for additional guidance.`,
		},
	},
	create(context) {
		const config = getConfig(context.options[0]);

		return errorBoundary(
			{
				'JSXElement[openingElement.name.name=span]': (node: Rule.Node) => {
					return SpanElements.lint(node, { context, config });
				},
				'JSXElement[openingElement.name.name=p]': (node: Rule.Node) => {
					return ParagraphElements.lint(node, { context, config });
				},
				'JSXElement[openingElement.name.name=strong]': (node: Rule.Node) => {
					return StrongElements.lint(node, { context, config });
				},
				'JSXElement[openingElement.name.name=em]': (node: Rule.Node) => {
					return EmphasisElements.lint(node, { context, config });
				},
			},
			config,
		);
	},
});

export default rule;
