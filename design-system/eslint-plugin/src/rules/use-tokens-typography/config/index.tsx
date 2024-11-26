/* eslint-disable @atlassian/tangerine/import/entry-points */

import { type JSONSchema4 } from '@typescript-eslint/utils/dist/json-schema';

export type RuleConfig = {
	failSilently: boolean;
	shouldEnforceFallbacks: boolean;
	enableUnsafeAutofix: boolean;
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
		},
	},
};

const defaultConfig: RuleConfig = {
	failSilently: false,
	shouldEnforceFallbacks: true,
	enableUnsafeAutofix: false,
};

export const getConfig = (overrides: Partial<RuleConfig>): RuleConfig => {
	return Object.assign({}, defaultConfig, overrides);
};
