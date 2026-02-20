import type { ADFMark, ADFMarkSpec } from '@atlaskit/adf-schema-generator';
import { adfMark } from '@atlaskit/adf-schema-generator';

export const breakout: ADFMark<ADFMarkSpec> = adfMark('breakout').define({
	spanning: false,
	inclusive: false,
	attrs: {
		mode: { type: 'enum', values: ['wide', 'full-width'], default: 'wide' },
		width: { type: 'number', default: null, optional: true },
	},
});
