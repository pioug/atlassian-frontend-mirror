import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';
import { errorBoundary } from '../utils/error-boundary';

import { getConfig } from './config';
import { RestrictedCapitalisation, RestrictedProperty, WrappedTokenValue } from './linters';

const typescriptErrorMessage =
	'There is ongoing work to make this a TypeScript error. Once that happens, you will have to delete/refactor anyway.';

const rule = createLintRule({
	meta: {
		name: 'use-latest-xcss-syntax-typography',
		type: 'problem',
		fixable: 'code',
		hasSuggestions: false,
		docs: {
			description:
				'Prohibits use of unsafe styling properties in xcss. Please use Text/Heading primitives instead.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noRestrictedTypographyProperties: `Don't set '{{ property }}' on xcss as it allows invalid combinations of typography tokens. ${typescriptErrorMessage}`,
			noRestrictedTypographyPropertiesHeading: `Don't set '{{ property }}' on xcss in combination with 'font' heading tokens. ${typescriptErrorMessage}`,
			noRestrictedCapitalisation: `Avoid using ALL CAPS as it reduces readability and is bad for accessibility.`,
			noWrappedTokenTypographyValues: `Don't wrap typography tokens in xcss. ${typescriptErrorMessage}`,
		},
	},
	create(context) {
		const config = getConfig(context.options[0]);

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
