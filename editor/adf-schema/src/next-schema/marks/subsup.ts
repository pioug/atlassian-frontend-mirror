import { adfMark } from '@atlaskit/adf-schema-generator';

export const subsup = adfMark('subsup').define({
	inclusive: true,
	attrs: {
		type: { type: 'enum', values: ['sub', 'sup'], default: 'sub' },
	},
});
