import type {
	ADFCommonNodeSpec,
	ADFNode,
} from '@atlaskit/adf-schema-generator';
import { $or, $zeroPlus, adfNode } from '@atlaskit/adf-schema-generator';
import { inlineContentGroup } from '../groups/inlineContentGroup';
import { inlineGroup } from '../groups/inlineGroup';
import { alignment, indentation } from '../marks/alignmentAndIndentation';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const heading: ADFNode<
	[string, 'with_alignment', 'with_indentation', 'with_no_marks'],
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
		marks: never[];
		noMarks: true;
	}
> = adfNode('heading')
	.define({
		defining: true,
		selectable: false,
		marks: [unsupportedMark, unsupportedNodeAttribute],
		hasEmptyMarks: true,
		attrs: {
			level: { type: 'number', default: 1, minimum: 1, maximum: 6 },
			localId: { type: 'string', optional: true, default: null },
		},
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
	.variant('with_no_marks', {
		content: [],
		marks: [],
		noMarks: true,
		ignore: [],
	});

export const headingWithMarks: ADFNode<
	[string, 'with_alignment', 'with_indentation', 'with_no_marks'],
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
		marks: never[];
		noMarks: true;
	}
> = heading;
