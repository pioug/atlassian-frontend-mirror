/* eslint-disable @atlassian/tangerine/import/entry-points */

import { type JSONSchema4 } from '@typescript-eslint/utils/dist/json-schema';

type Pattern = 'style-object' | 'font-weight' | 'font-family' | 'banned-properties';

export type RuleConfig = {
	failSilently: boolean;
	shouldEnforceFallbacks: boolean;
	enableUnsafeAutofix: boolean;
	patterns: Pattern[];
};

export const ruleSchema: JSONSchema4 = {
	type: 'array',
	items: {
		type: 'object',
		properties: {
			failSilently: {
				type: 'boolean',
			},
			shouldEnforceFallbacks: {
				type: 'boolean',
			},
			enableUnsafeAutofix: {
				type: 'boolean',
			},
			patterns: {
				type: 'array',
				items: {
					type: 'string',
					enum: ['style-object', 'font-weight', 'font-family', 'banned-properties'],
				},
			},
		},
	},
};

const defaultConfig: RuleConfig = {
	failSilently: false,
	shouldEnforceFallbacks: false,
	enableUnsafeAutofix: false,
	patterns: ['style-object'],
};

export const getConfig = (overrides: Partial<RuleConfig>): RuleConfig => {
	return Object.assign({}, defaultConfig, overrides);
};
