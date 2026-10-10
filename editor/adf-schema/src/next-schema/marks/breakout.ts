import type { ADFMark } from '@atlaskit/adf-schema-generator/adfMark';
import { adfMark } from '@atlaskit/adf-schema-generator/adfMark';
import type { ADFMarkSpec } from '@atlaskit/adf-schema-generator/types/ADFMarkSpec';

export const breakout: ADFMark<ADFMarkSpec> = adfMark('breakout').define({
	spanning: false,
	inclusive: false,
	attrs: {
		mode: { type: 'enum', values: ['wide', 'full-width'], default: 'wide' },
		width: { type: 'number', default: null, optional: true },
	},
});
