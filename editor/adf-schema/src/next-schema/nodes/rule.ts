import { adfNode } from '@atlaskit/adf-schema-generator';

export const rule = adfNode('rule').define({
	attrs: { localId: { type: 'string', default: null, optional: true } },
});
