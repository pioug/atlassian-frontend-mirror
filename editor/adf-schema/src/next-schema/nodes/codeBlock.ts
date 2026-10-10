import { $or } from '@atlaskit/adf-schema-generator/$or';
import { $zeroPlus } from '@atlaskit/adf-schema-generator/$zeroPlus';
import type { ADFNode } from '@atlaskit/adf-schema-generator/adfNode';
import { adfNode } from '@atlaskit/adf-schema-generator/adfNode';
import type { ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator/types/ADFNodeSpec';

import { breakout } from '../marks/breakout';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { text } from './text';
import { unsupportedInline } from './unsupportedInline';

export const codeBlock: ADFNode<
	[string, 'root_only'],
	ADFCommonNodeSpec & {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		marks: any[];
		noExtend: true;
		noMarks: false;
	}
> = adfNode('codeBlock')
	.define({
		code: true,
		defining: true,
		attrs: {
			language: { type: 'string', default: null, optional: true },
			uniqueId: { type: 'string', default: null, optional: true },
			localId: { type: 'string', default: null, optional: true },
			wrap: { type: 'boolean', default: null, optional: true },
			hideLineNumbers: { type: 'boolean', default: false, optional: true },
		},
		noMarks: true,
		content: [$zeroPlus($or(text.use('with_no_marks'), unsupportedInline))],
	})
	// Variant used root scenario where we have breakout
	.variant('root_only', {
		marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
		noMarks: false,
		noExtend: true,
	});
