import type { JSONSchema } from '@typescript-eslint/utils';

export const ruleSchema: JSONSchema.JSONSchema4 = {
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
