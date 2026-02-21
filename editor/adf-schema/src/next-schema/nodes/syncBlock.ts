import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { adfNode } from '@atlaskit/adf-schema-generator';
import { breakout } from '../marks/breakout';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const syncBlock: ADFNode<[string], ADFCommonNodeSpec> = adfNode('syncBlock').define({
	selectable: true,
	marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
	attrs: {
		resourceId: { type: 'string', default: '' },
		localId: { type: 'string', default: '' },
	},
});
