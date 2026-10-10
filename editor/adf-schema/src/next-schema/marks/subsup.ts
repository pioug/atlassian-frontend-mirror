import type { ADFMark } from '@atlaskit/adf-schema-generator/adfMark';
import { adfMark } from '@atlaskit/adf-schema-generator/adfMark';
import type { ADFMarkSpec } from '@atlaskit/adf-schema-generator/types/ADFMarkSpec';

export const subsup: ADFMark<ADFMarkSpec> = adfMark('subsup').define({
	inclusive: true,
	attrs: {
		type: { type: 'enum', values: ['sub', 'sup'], default: 'sub' },
	},
});
