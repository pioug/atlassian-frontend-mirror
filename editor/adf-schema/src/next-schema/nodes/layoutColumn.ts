import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';
import { blockContentGroup } from '../groups/blockContentGroup';
import { blockGroup } from '../groups/blockGroup';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { unsupportedBlock } from '../nodes/unsupportedBlock';

export const layoutColumn = adfNode('layoutColumn').define({
	isolating: true,
	selectable: false,

	marks: [unsupportedMark, unsupportedNodeAttribute],

	attrs: {
		width: { type: 'number', minimum: 0, maximum: 100, default: undefined },
		localId: { type: 'string', default: null, optional: true },
	},
	content: [$onePlus($or(blockGroup, blockContentGroup, unsupportedBlock))],
});
