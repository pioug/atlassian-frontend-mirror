import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { $or, $zeroPlus, adfNode } from '@atlaskit/adf-schema-generator';
import { inlineContentGroup } from '../groups/inlineContentGroup';
import { inlineGroup } from '../groups/inlineGroup';
import { alignment, indentation } from '../marks/alignmentAndIndentation';
import { fontSize } from '../marks/fontSize';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const paragraph: ADFNode<
	[
		string,
		'with_alignment',
		'with_indentation',
		'with_marks',
		'with_no_marks',
		'with_font_size',
		'with_font_size_and_alignment',
		'with_font_size_and_indentation',
	],
	ADFCommonNodeSpec & {
		content: never[];
		ignore: never[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		marks: any[];
	} & {
		content: never[];
		ignore: never[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		marks: any[];
	} & {
		content: never[];
		ignore: never[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		marks: any[];
	} & {
		content: never[];
		ignore: never[];
		marks: never[];
		noMarks: true;
	} & {
		content: never[];
		ignore: never[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		marks: any[];
		stage0: true;
	} & {
		content: never[];
		ignore: never[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		marks: any[];
		stage0: true;
	} & {
		content: never[];
		ignore: never[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		marks: any[];
		stage0: true;
	}
> = adfNode('paragraph')
	.define({
		attrs: {
			localId: { type: 'string', optional: true, default: null },
		},
		selectable: false,
		marks: [unsupportedMark, unsupportedNodeAttribute],
		hasEmptyMarks: true,
		content: [$zeroPlus($or(inlineGroup, inlineContentGroup))],
	})
	.variant('with_alignment', {
		marks: [alignment, unsupportedMark, unsupportedNodeAttribute],
		content: [],
		ignore: [],
	})
	.variant('with_indentation', {
		marks: [indentation, unsupportedMark, unsupportedNodeAttribute],
		content: [],
		ignore: [],
	})
	.variant('with_marks', {
		marks: [alignment, unsupportedMark, unsupportedNodeAttribute],
		content: [],
		ignore: [],
	})
	.variant('with_no_marks', {
		content: [],
		marks: [],
		noMarks: true,
		ignore: [],
	})
	.variant('with_font_size', {
		marks: [fontSize, unsupportedMark, unsupportedNodeAttribute],
		content: [],
		ignore: [],
		stage0: true,
	})
	.variant('with_font_size_and_alignment', {
		marks: [fontSize, alignment, unsupportedMark, unsupportedNodeAttribute],
		content: [],
		ignore: [],
		stage0: true,
	})
	.variant('with_font_size_and_indentation', {
		marks: [fontSize, indentation, unsupportedMark, unsupportedNodeAttribute],
		content: [],
		ignore: [],
		stage0: true,
	});
