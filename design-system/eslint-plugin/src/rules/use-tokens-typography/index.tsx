import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { getConfig, ruleSchema } from './config';
import { errorBoundary } from './error-boundary';
import { StyleObject } from './transformers/style-object';

const create: Rule.RuleModule['create'] = (context: Rule.RuleContext) => {
	const config = getConfig(context.options[0]);

	return {
		// const styles = css({ fontSize: '14px, ... }), styled.div({ fontSize: 14, ... })
		ObjectExpression: (node: Rule.Node) =>
			errorBoundary(
				() => {
					return StyleObject.lint(node, { context, config });
				},
				{ config },
			),
	};
};

const rule = createLintRule({
	meta: {
		name: 'use-tokens-typography',
		type: 'suggestion',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description:
				'Enforces usage of design tokens for typography properties rather than hard-coded values.',
			recommended: false,
			severity: 'warn',
		},
		messages: {
			noRawTypographyValues:
				'Typography primitives or tokens should be used instead of hard-coded values.\n\n@meta <<{{payload}}>>.',
		},
		schema: ruleSchema,
	},
	create,
});

export default rule;
