import type { ADFMark, ADFMarkSpec } from '@atlaskit/adf-schema-generator';
import { adfMark } from '@atlaskit/adf-schema-generator';

export const subsup: ADFMark<ADFMarkSpec> = adfMark('subsup').define({
	inclusive: true,
	attrs: {
		type: { type: 'enum', values: ['sub', 'sup'], default: 'sub' },
	},
});
