import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { adfNode } from '@atlaskit/adf-schema-generator';
import { annotation } from '../marks/annotation';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const date: ADFNode<[string], ADFCommonNodeSpec> = adfNode('date').define({
	inline: true,
	selectable: true,

	marks: [unsupportedNodeAttribute, unsupportedMark],

	attrs: {
		timestamp: { minLength: 1, type: 'string', default: '' },
		localId: { type: 'string', default: null, optional: true },
	},

	stage0: {
		marks: [unsupportedNodeAttribute, unsupportedMark, annotation],
	},
});
