import { $or, $zeroPlus, adfNode } from '@atlaskit/adf-schema-generator';
import { inlineContentGroup } from '../groups/inlineContentGroup';
import { inlineGroup } from '../groups/inlineGroup';
import { alignment, indentation } from '../marks/alignmentAndIndentation';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const paragraph = adfNode('paragraph')
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
	});
