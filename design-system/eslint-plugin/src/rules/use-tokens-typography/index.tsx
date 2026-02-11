import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';
import { errorBoundary } from '../utils/error-boundary';

import { getConfig, type RuleConfig, ruleSchema } from './config';
import { BannedProperties } from './transformers/banned-properties';
import { FontFamily } from './transformers/font-family';
import { FontWeight } from './transformers/font-weight';
import { RestrictedCapitalisation } from './transformers/restricted-capitalisation';
import { StyleObject } from './transformers/style-object';
import { UntokenizedProperties } from './transformers/untokenized-properties';

const create: Rule.RuleModule['create'] = (context: Rule.RuleContext) => {
	// TODO: JFP-2823 - this type cast was added due to Jira's ESLint v9 migration
	const config = getConfig(context.options[0] as unknown as Partial<RuleConfig>);

	return errorBoundary(
		{
			// const styles = css({ fontSize: '14px', ... }), styled.div({ fontSize: 14, ... })
			ObjectExpression: (node: Rule.Node) => StyleObject.lint(node, { context, config }),

			// const styles = css({ fontWeight: 600, 'bold', ... })
			'ObjectExpression > Property > Identifier[name=/^fontWeight$/]': (node: Rule.Node) =>
				FontWeight.lint(node.parent, { context, config }),

			// const styles = css({ fontFamily: 'Arial, sans-serif', ... })
			'ObjectExpression > Property > Identifier[name=/^fontFamily$/]': (node: Rule.Node) =>
				FontFamily.lint(node.parent, { context, config }),

			// const styles = css({ font: 'bold 36px Helvetica, Arial', ... })
			'ObjectExpression > Property > Identifier[name=/^font$/]': (node: Rule.Node) =>
				UntokenizedProperties.lint(node.parent, { context, config }),

			// const styles = css({ lineHeight: 1.2, letterSpacing: 0.003, ... })
			'ObjectExpression > Property > Identifier[name=/^(lineHeight|letterSpacing)$/]': (
				node: Rule.Node,
			) => BannedProperties.lint(node.parent, { context, config }),

			// const styles = css({ textTransform: 'uppercase', ... })
			'ObjectExpression > Property > Identifier[name=/^textTransform$/]': (node: Rule.Node) =>
				RestrictedCapitalisation.lint(node.parent, { context, config }),
		},
		config,
	);
};

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'use-tokens-typography',
		type: 'suggestion',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description:
				'Enforces usage of design tokens for typography properties rather than hard-coded values.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noRawTypographyValues:
				'Typography primitives or tokens should be used instead of hard-coded values.',
			noFontSizeTypographyToken:
				'Using tokens with the `fontSize` property is invalid. Any `font.heading` or `font.body` tokens must use the CSS `font` property.',
			noRawFontWeightValues: 'Font weight tokens should be used instead of hard-coded values.',
			noRawFontFamilyValues: 'Font family tokens should be used instead of hard-coded values.',
			noUntokenizedProperties: 'Use typography tokens for `{{property}}`.',
			noBannedProperties:
				'Do not use `{{property}}`. Typography tokens automatically specify `{{property}}` alongside font size and font weight.',
			noRestrictedCapitalisation: `Avoid using ALL CAPS as it reduces readability and is bad for accessibility.`,
		},
		schema: ruleSchema,
	},
	create,
});

export default rule;
