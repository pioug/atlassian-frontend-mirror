import { $or } from '@atlaskit/adf-schema-generator/$or';
import { $zeroPlus } from '@atlaskit/adf-schema-generator/$zeroPlus';
import type { ADFNode } from '@atlaskit/adf-schema-generator/adfNode';
import { adfNode } from '@atlaskit/adf-schema-generator/adfNode';
import type { ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator/types/ADFNodeSpec';

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
