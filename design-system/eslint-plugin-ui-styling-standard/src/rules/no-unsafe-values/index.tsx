import type { JSONSchema4 } from 'json-schema';

import { getScope } from '@atlaskit/eslint-utils/context-compat';
import {
	getImportSources,
	isCss,
	isCssMap,
	isKeyframes,
	isStyled,
	isXcss,
} from '@atlaskit/eslint-utils/is-supported-import';

import { createLintRule } from '../utils/create-rule';

import { messages } from './messages';
import { Linter } from './utils';

const schema: JSONSchema4 = [
	{
		type: 'object',
		additionalProperties: false,
		properties: {
			importSources: {
				type: 'array',
				items: { type: 'string' },
				uniqueItems: true,
			},
			allowedFunctionCalls: {
				type: 'array',
				items: {
					type: 'array',
					minItems: 2,
					maxItems: 2,
					items: [{ type: 'string' }, { type: 'string' }],
				},
				uniqueItems: true,
			},
			allowedDynamicKeys: {
				type: 'array',
				items: {
					type: 'array',
					minItems: 2,
					maxItems: 2,
					items: [{ type: 'string' }, { type: 'string' }],
				},
				uniqueItems: true,
			},
		},
	},
];

export const rule = createLintRule({
	meta: {
		name: 'no-unsafe-values',
		docs: {
			description: 'Disallows styles that are difficult/impossible to statically anaylze.',
			recommended: true,
			severity: 'error',
		},
		messages,
		type: 'problem',
		schema,
	},
	create(context) {
		const importSources = getImportSources(context);

		return {
			CallExpression(node) {
				const { references } = getScope(context, node);

				if (
					!isCss(node.callee, references, importSources) &&
					!isStyled(node.callee, references, importSources) &&
					!isKeyframes(node.callee, references, importSources) &&
					!isCssMap(node.callee, references, importSources) &&
					!isXcss(node.callee, references, importSources)
				) {
					return;
				}

				if (
					isStyled(node.callee, references, importSources) &&
					(node.parent.type === 'CallExpression' || node.parent.type === 'TaggedTemplateExpression')
				) {
					/**
					 * If it is of the form styled(Base)({}) we don't want to lint the inner function arguments.
					 */
					return;
				}

				const linter = new Linter(context, node);
				linter.run();
			},
		};
	},
});

export default rule;
