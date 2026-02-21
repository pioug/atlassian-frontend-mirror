import type { JSONSchema4 } from 'json-schema';

import { createNoExportedRule } from '@atlaskit/eslint-utils/create-no-exported-rule';
import {
	isCss,
	isCssMap,
	isKeyframes,
	isStyled,
	isXcss,
	type SupportedNameChecker,
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

const supportedImports: readonly SupportedNameChecker[] = [
	isCss,
	isCssMap,
	isKeyframes,
	isXcss,
	isStyled,
];

export const rule: import('eslint').Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-exported-styles',
		docs: {
			description: 'Disallows exports of css, keyframes, styled and xcss',
			recommended: true,
			severity: 'error',
		},
		messages: {
			'no-exported-styles':
				'Styles from css, cssMap, keyframes, styled and xcss should not be exported. All styles should be defined and used in the same file instead.',
		},
		type: 'problem',
		schema,
	},
	create: createNoExportedRule(supportedImports, 'no-exported-styles'),
});

export default rule;
