import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';
import { errorBoundary } from '../utils/error-boundary';

import { getConfig } from './config';
import { BannedProperty } from './linters';

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
			noUnsafeTypographyProperties: `Don't set '{{ property }}' on xcss. They are unsafe as they allow invalid combinations of typography tokens. There is ongoing work to make this a TypeScript error. Once that happens, you will have to delete/refactor anyway.`,
		},
	},
	create(context) {
		const config = getConfig(context.options[0]);

		return errorBoundary(
			{
				'CallExpression[callee.name="xcss"] ObjectExpression > Property > Identifier[name=/(fontSize|lineHeight|fontWeight|letterSpacing)/]':
					(node: Rule.Node) => BannedProperty.lint(node, { context }),
				'CallExpression[callee.name="xcss"] ObjectExpression > Property > Literal[value=/(fontSize|lineHeight|fontWeight|letterSpacing)/]':
					(node: Rule.Node) => BannedProperty.lint(node, { context }),
			},
			config,
		);
	},
});

export default rule;
