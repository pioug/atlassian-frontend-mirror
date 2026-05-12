import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';
import { blockContentGroup } from '../groups/blockContentGroup';
import { blockGroup } from '../groups/blockGroup';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { unsupportedBlock } from '../nodes/unsupportedBlock';

const layoutColumnAttributes = {
	width: { type: 'number' as const, minimum: 0, maximum: 100, default: undefined },
	localId: { type: 'string' as const, default: null, optional: true },
};

export const layoutColumn: ADFNode<[string], ADFCommonNodeSpec> = adfNode('layoutColumn').define({
	isolating: true,
	selectable: false,

	marks: [unsupportedMark, unsupportedNodeAttribute],

	attrs: layoutColumnAttributes,
	content: [$onePlus($or(blockGroup, blockContentGroup, unsupportedBlock))],
	stage0: {
		attrs: {
			...layoutColumnAttributes,
			valign: {
				type: 'enum',
				values: ['top', 'middle', 'bottom'],
				default: null,
				optional: true,
			},
		},
	},
});
