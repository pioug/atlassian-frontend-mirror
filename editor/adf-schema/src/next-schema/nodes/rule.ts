import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { adfNode } from '@atlaskit/adf-schema-generator';
import { breakout } from '../marks/breakout';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const rule: ADFNode<[string, 'root_only'], ADFCommonNodeSpec> = adfNode('rule')
	.define({
		attrs: { localId: { type: 'string', default: null, optional: true } },
	})
	// this variant is used to support breakout resizing for rule nodes at the document root
	.variant('root_only', {
		stage0: true,
		marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
	});
