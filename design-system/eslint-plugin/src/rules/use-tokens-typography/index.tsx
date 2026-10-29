import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { errorBoundary } from '../utils/error-boundary';
import { getConfig } from './config/get-config';
import { ruleSchema } from './config/rule-schema';
import type { RuleConfig } from './config/types';
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
				"Use Text or Heading for semantic text, or replace the font-size/line-height combination with font: token('font.body') or an appropriate font.heading.* token from @atlaskit/tokens.",
			noFontSizeTypographyToken:
				'Move this font.body or font.heading.* token from fontSize to the CSS font property; these tokens provide the complete font declaration.',
			noRawFontWeightValues:
				"Replace the raw fontWeight with the matching font.weight.* token using token() from @atlaskit/tokens, or use the Text primitive's weight prop when appropriate.",
			noRawFontFamilyValues:
				'Replace the raw fontFamily with the matching font.family.* token using token() from @atlaskit/tokens; use a text primitive when it provides the intended typography.',
			noUntokenizedProperties:
				'Replace the raw {{property}} value with the matching font.* token using token() from @atlaskit/tokens; font.body and font.heading.* tokens belong on the CSS font property.',
			noBannedProperties:
				'Remove the separate {{property}} override. Select the intended typography through Text/Heading or a complete font.body or font.heading.* token so its metrics stay consistent.',
			noRestrictedCapitalisation:
				"Remove textTransform: 'uppercase' and keep the text's intended casing; forcing all caps reduces readability.",
		},
		schema: ruleSchema,
	},
	create,
});

export default rule;
