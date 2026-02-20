import type { ADFMark, ADFMarkSpec } from '@atlaskit/adf-schema-generator';
import { adfMark } from '@atlaskit/adf-schema-generator';

export const dataConsumer: ADFMark<ADFMarkSpec> = adfMark(
	'dataConsumer',
).define({
	attrs: {
		sources: {
			type: 'array',
			items: { type: 'string' },
			minItems: 1,
			default: [],
		},
	},
});
