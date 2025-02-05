// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import type { Expression, SpreadElement } from 'estree';
import type { JSONSchema4 } from 'json-schema';

import { getScope, getSourceCode } from '@atlaskit/eslint-utils/context-compat';
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

export const rule = createLintRule({
	meta: {
		name: 'no-array-arguments',
		docs: {
			description: 'Prevents usage of array arguments to style declaration functions',
			recommended: true,
			severity: 'error',
		},
		messages: {
			'no-array-arguments':
				"Don't pass multiple value in an array. Pass them as multiple arguments instead.",
		},
		type: 'problem',
		fixable: 'code',
		schema,
	},
	create(context) {
		const importSources = getImportSources(context);
		return {
			CallExpression(node) {
				const { references } = getScope(context, node);

				if (!hasStyleObjectArguments(node.callee, references, importSources)) {
					return;
				}

				for (const argument of node.arguments) {
					if (argument.type === 'ArrayExpression') {
						context.report({
							node: argument,
							messageId: 'no-array-arguments',
							fix(fixer) {
								if (argument.elements.length === 0) {
									/**
									 * Don't autofix if it's an empty array.
									 *
									 * I couldn't figure out how to get rid of the comma afterwards,
									 * so the autofix was producing syntax problems.
									 *
									 * This is an edge case that shouldn't actually be happening,
									 * but if it does it's not hard to just delete the empty array...
									 */
									return null;
								}

								const items = argument.elements
									.filter(
										(
											value: SpreadElement | Expression | null,
										): value is SpreadElement | Expression => value !== null,
									)
									.map((element) => getSourceCode(context).getText(element));

								return fixer.replaceText(argument, items.join(', '));
							},
						});
					}
				}
			},
		};
	},
});

export default rule;
