/* eslint-disable @atlassian/tangerine/import/entry-points */

import type { JSONSchema4 } from '@typescript-eslint/utils/dist/json-schema';

export const ruleSchema: JSONSchema4 = {
	type: 'array',
	items: {
		type: 'object',
		properties: {
			failSilently: {
				type: 'boolean',
			},
			enableUnsafeAutofix: {
				type: 'boolean',
			},
			patterns: {
				type: 'array',
				items: {
					type: 'string',
					enum: [
						'style-object',
						'font-weight',
						'font-family',
						'untokenized-properties',
						'banned-properties',
						'restricted-capitalisation',
					],
				},
			},
		},
	},
};
