import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { errorBoundary } from '../utils/error-boundary';
import { getConfig } from './config/get-config';
import { PATTERNS } from './config/patterns';
import type { RuleConfig } from './config/types';
import { RestrictedCapitalisation } from './linters/restricted-capitalisation';
import { RestrictedProperty } from './linters/restricted-property';
import { WrappedTokenValue } from './linters/wrapped-token-value';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'use-latest-xcss-syntax-typography',
		type: 'problem',
		fixable: 'code',
		hasSuggestions: false,
		schema: [
			{
				type: 'object',
				properties: {
					failSilently: {
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
			description:
				'Prohibits use of unsafe styling properties in xcss. Please use Text/Heading primitives instead.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noRestrictedTypographyProperties:
				'Use Text or Heading with the appropriate size instead of setting {{ property }} in legacy xcss(). Their supported props and complete font.* tokens keep typography consistent.',
			noRestrictedTypographyPropertiesHeading:
				'Remove the {{ property }} override from this legacy xcss() heading style. Choose Heading size or a complete font.heading.* token instead of overriding one part of the heading typography.',
			noRestrictedCapitalisation:
				'Remove textTransform: uppercase from this style and use sentence case in the authored text. Preserve required casing for product names and acronyms.',
			noWrappedTokenTypographyValues:
				"Inside legacy xcss(), pass a bare typography token name, for example font: 'font.heading.medium', rather than token('font.heading.medium'). Compiled cssMap() uses token() calls instead.",
		},
	},
	create(context) {
		// TODO: JFP-2823 - this type cast was added due to Jira's ESLint v9 migration
		const config = getConfig(context.options[0] as unknown as Partial<RuleConfig>);

		return errorBoundary(
			{
				'CallExpression[callee.name="xcss"] ObjectExpression > Property > Identifier[name=/(fontSize|lineHeight|fontWeight|letterSpacing)/]':
					(node: Rule.Node) => RestrictedProperty.lint(node, { context, config }),
				'CallExpression[callee.name="xcss"] ObjectExpression > Property > Literal[value=/(fontSize|lineHeight|fontWeight|letterSpacing)/]':
					(node: Rule.Node) => RestrictedProperty.lint(node, { context, config }),
				'CallExpression[callee.name="xcss"] ObjectExpression > Property > Identifier[name=textTransform]':
					(node: Rule.Node) => RestrictedCapitalisation.lint(node, { context, config }),
				'CallExpression[callee.name="xcss"] ObjectExpression > Property > Literal[value=textTransform]':
					(node: Rule.Node) => RestrictedCapitalisation.lint(node, { context, config }),
				'CallExpression[callee.name="xcss"] ObjectExpression > Property > Identifier[name=/(font|fontFamily|fontWeight)/]':
					(node: Rule.Node) => WrappedTokenValue.lint(node, { context, config }),
				'CallExpression[callee.name="xcss"] ObjectExpression > Property > Literal[value=/(font|fontFamily|fontWeight)/]':
					(node: Rule.Node) => WrappedTokenValue.lint(node, { context, config }),
			},
			config,
		);
	},
});

export default rule;
