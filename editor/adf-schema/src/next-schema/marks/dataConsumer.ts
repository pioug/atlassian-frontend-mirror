import type { ADFMark } from '@atlaskit/adf-schema-generator/adfMark';
import { adfMark } from '@atlaskit/adf-schema-generator/adfMark';
import type { ADFMarkSpec } from '@atlaskit/adf-schema-generator/types/ADFMarkSpec';

export const dataConsumer: ADFMark<ADFMarkSpec> = adfMark('dataConsumer').define({
	attrs: {
		sources: {
			type: 'array',
			items: { type: 'string' },
			minItems: 1,
			default: [],
		},
	},
});
