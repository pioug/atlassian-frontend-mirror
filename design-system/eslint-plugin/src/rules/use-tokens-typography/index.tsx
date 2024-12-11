import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';
import { errorBoundary } from '../utils/error-boundary';

import { getConfig, ruleSchema } from './config';
import { FontFamily } from './transformers/font-family';
import { FontWeight } from './transformers/font-weight';
import { StyleObject } from './transformers/style-object';

const create: Rule.RuleModule['create'] = (context: Rule.RuleContext) => {
	const config = getConfig(context.options[0]);

	return errorBoundary(
		{
			// const styles = css({ fontSize: '14px', ... }), styled.div({ fontSize: 14, ... })
			ObjectExpression: (node: Rule.Node) => StyleObject.lint(node, { context, config }),

			// const styles = css({ fontWeight: 600, 'bold', ... })
			'ObjectExpression > Property > Identifier[name=/fontWeight/]': (node: Rule.Node) =>
				FontWeight.lint(node.parent, { context, config }),

			// const styles = css({ fontFamily: 'Arial, sans-serif', ... })
			'ObjectExpression > Property > Identifier[name=/fontFamily/]': (node: Rule.Node) =>
				FontFamily.lint(node.parent, { context, config }),
		},
		config,
	);
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
				'Typography primitives or tokens should be used instead of hard-coded values.\n\n@meta <<{{payload}}>>.\n\nNOTE: Using tokens with the `fontSize` property is invalid. Any `font.heading` or `font.body` tokens must use the CSS `font` property.',
			noRawFontWeightValues: 'Font weight tokens should be used instead of hard-coded values.',
			noRawFontFamilyValues: 'Font family tokens should be used instead of hard-coded values.',
		},
		schema: ruleSchema,
	},
	create,
});

export default rule;
