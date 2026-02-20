import type { ADFMark, ADFMarkSpec } from '@atlaskit/adf-schema-generator';
import { adfMark } from '@atlaskit/adf-schema-generator';

export const border: ADFMark<ADFMarkSpec> = adfMark('border').define({
	inclusive: false,
	attrs: {
		size: { type: 'number', minimum: 1, maximum: 3 },
		color: { pattern: '^#[0-9a-fA-F]{8}$|^#[0-9a-fA-F]{6}$', type: 'string' },
	},
});
