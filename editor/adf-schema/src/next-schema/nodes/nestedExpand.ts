import type { ADFCommonNodeSpec, ADFNode} from '@atlaskit/adf-schema-generator';
import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { blockquote } from './blockquote';
import { codeBlock } from './codeBlock';
import { decisionList } from './decisionList';
import { extension } from './extension';
import { heading } from './heading';
import { bulletList, orderedList } from './list';
import { mediaGroup } from './mediaGroup';
import { mediaSingle } from './mediaSingle';
import { panel } from './panel';
import { paragraph } from './paragraph';
import { rule } from './rule';
import { taskList } from './task';
import { unsupportedBlock } from './unsupportedBlock';

const nestedExpandContent = [
	paragraph.use('with_no_marks'),
	heading.use('with_no_marks'),
	mediaSingle.use('caption'),
	mediaSingle.use('full'),
	mediaGroup,
	codeBlock,
	bulletList,
	orderedList,
	taskList,
	decisionList,
	rule,
	panel,
	blockquote,
	unsupportedBlock,
];
export const nestedExpand: ADFNode<[string, "content", "with_no_marks"], ADFCommonNodeSpec & {
    ignore: "pm-spec"[];
} & {
    content: never[];
    marks: never[];
    noMarks: true;
}> = adfNode('nestedExpand')
	.define({
		isolating: true,
		selectable: true,

		marks: [unsupportedMark, unsupportedNodeAttribute],

		attrs: {
			title: { type: 'string', default: '', optional: true },
			__expanded: { type: 'boolean', default: true, optional: true },
			localId: { type: 'string', default: null, optional: true },
		},

		content: [$onePlus($or(...nestedExpandContent, extension.use('with_marks')))],

		DANGEROUS_MANUAL_OVERRIDE: {
			'validator-spec': {
				'props.attrs.optional': {
					remove: true,
					reason: '@DSLCompatibilityException - mismatch with DSL',
				},
				'props.content': {
					value: 'nestedExpand_content',
					reason: '@DSLCompatibilityException - mismatch with DSL',
				},
				required: {
					reason: '@DSLCompatibilityException - required for nestedExpand validator spec',
					value: ['content'],
				},
			},
		},
	})
	.variant('content', {
		ignore: ['pm-spec'],
	})
	.variant('with_no_marks', {
		marks: [],
		content: [],
		noMarks: true,
	});
