import esquery from 'esquery';
import type { JSONSchema4 } from 'json-schema';

import { getScope } from '@atlaskit/eslint-utils/context-compat';
import {
	getImportSources,
	hasStyleObjectArguments,
} from '@atlaskit/eslint-utils/is-supported-import';

import { createLintRule } from '../utils/create-rule';

const schema: JSONSchema4 = [
	{
		type: 'object',
		properties: {
			importSources: {
				type: 'array',
				items: { type: 'string' },
				uniqueItems: true,
			},
		},
	},
];

export const rule: import("eslint").Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-dynamic-styles',
		docs: {
			description: 'Disallows use of dynamic styles in CSS-in-JS calls',
			recommended: true,
			severity: 'error',
		},
		schema,
		messages: {
			'no-dynamic-styles':
				'Dynamic styles are not allowed. Instead use the style prop to apply styles derived from component props.',
		},
		type: 'problem',
	},
	create(context) {
		const importSources = getImportSources(context);

		return {
			CallExpression(node) {
				const { references } = getScope(context, node);

				if (!hasStyleObjectArguments(node.callee, references, importSources)) {
					return;
				}

				const matches = esquery(node, 'ArrowFunctionExpression, FunctionExpression');

				for (const match of matches) {
					context.report({ node: match, messageId: 'no-dynamic-styles' });
				}
			},
		};
	},
});

export default rule;
