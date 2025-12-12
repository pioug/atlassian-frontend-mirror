import { adfMark } from '@atlaskit/adf-schema-generator';

export const breakout = adfMark('breakout').define({
	spanning: false,
	inclusive: false,
	attrs: {
		mode: { type: 'enum', values: ['wide', 'full-width'], default: 'wide' },
		width: { type: 'number', default: null, optional: true },
	},
});
