import type { ADFCommonNodeSpec, ADFNode} from '@atlaskit/adf-schema-generator';
import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { decisionItem } from './decisionItem';
import { unsupportedBlock } from './unsupportedBlock';

export const decisionList: ADFNode<[string], ADFCommonNodeSpec> = adfNode('decisionList').define({
	defining: true,
	selectable: false,

	marks: [unsupportedMark, unsupportedNodeAttribute],

	attrs: {
		localId: { type: 'string', default: '' },
	},
	content: [$onePlus($or(decisionItem, unsupportedBlock))],
});
