import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { $or, $zeroPlus, adfNode } from '@atlaskit/adf-schema-generator';
import { breakout } from '../marks/breakout';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { text } from './text';
import { unsupportedInline } from './unsupportedInline';

export const codeBlock: ADFNode<
	[string, 'root_only', 'with_extended_attributes', 'root_only_with_extended_attributes'],
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
		},
		noMarks: true,
		content: [$zeroPlus($or(text.use('with_no_marks'), unsupportedInline))],
	})
	// Variant used root scenario where we have breakout
	.variant('root_only', {
		marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
		noMarks: false,
		noExtend: true,
	})
	// Stage-0 variant: adds wrap and hideLineNumbers attributes (ADF Change 101)
	.variant('with_extended_attributes', {
		attrs: {
			language: { type: 'string', default: null, optional: true },
			uniqueId: { type: 'string', default: null, optional: true },
			localId: { type: 'string', default: null, optional: true },
			wrap: { type: 'boolean', default: null, optional: true },
			hideLineNumbers: { type: 'boolean', default: false, optional: true },
		},
		stage0: true,
	})
	// Stage-0 variant: root_only marks + extended attributes (ADF Change 101)
	.variant('root_only_with_extended_attributes', {
		marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
		noMarks: false,
		noExtend: true,
		attrs: {
			language: { type: 'string', default: null, optional: true },
			uniqueId: { type: 'string', default: null, optional: true },
			localId: { type: 'string', default: null, optional: true },
			wrap: { type: 'boolean', default: null, optional: true },
			hideLineNumbers: { type: 'boolean', default: false, optional: true },
		},
		stage0: true,
	});
