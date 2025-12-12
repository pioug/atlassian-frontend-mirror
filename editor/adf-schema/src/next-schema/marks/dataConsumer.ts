import { adfMark } from '@atlaskit/adf-schema-generator';

export const dataConsumer = adfMark('dataConsumer').define({
	attrs: {
		sources: {
			type: 'array',
			items: { type: 'string' },
			minItems: 1,
			default: [],
		},
	},
});
