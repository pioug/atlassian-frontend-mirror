import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { adfNode } from '@atlaskit/adf-schema-generator';
import { annotation } from '../marks/annotation';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const emoji: ADFNode<[string], ADFCommonNodeSpec> = adfNode('emoji').define({
	inline: true,
	selectable: true,

	marks: [unsupportedNodeAttribute, unsupportedMark],

	attrs: {
		shortName: { type: 'string', default: '' },
		id: { type: 'string', default: '', optional: true },
		text: { type: 'string', default: '', optional: true },
		localId: { type: 'string', default: null, optional: true },
	},

	stage0: {
		marks: [unsupportedNodeAttribute, unsupportedMark, annotation],
	},
});
