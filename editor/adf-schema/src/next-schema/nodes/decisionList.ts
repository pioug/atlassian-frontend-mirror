import { $onePlus } from '@atlaskit/adf-schema-generator/$onePlus';
import { $or } from '@atlaskit/adf-schema-generator/$or';
import type { ADFNode } from '@atlaskit/adf-schema-generator/adfNode';
import { adfNode } from '@atlaskit/adf-schema-generator/adfNode';
import type { ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator/types/ADFNodeSpec';

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
