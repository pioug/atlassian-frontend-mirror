import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { $or, $zeroPlus, adfNode } from '@atlaskit/adf-schema-generator';
import { inlineContentGroup } from '../groups/inlineContentGroup';
import { inlineGroup } from '../groups/inlineGroup';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const decisionItem: ADFNode<[string], ADFCommonNodeSpec> = adfNode('decisionItem').define({
	defining: true,

	marks: [unsupportedMark, unsupportedNodeAttribute],
	allowAnyChildMark: true,

	attrs: {
		localId: { type: 'string', default: '' },
		state: {
			type: 'string',
			default: 'DECIDED',
		},
	},
	content: [$zeroPlus($or(inlineGroup, inlineContentGroup))],
});
