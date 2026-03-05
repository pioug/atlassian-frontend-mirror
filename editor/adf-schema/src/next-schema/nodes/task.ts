import type {
	ADFCommonNodeSpec,
	ADFNode,
	ADFNodeContentOneOrMoreSpec,
} from '@atlaskit/adf-schema-generator';
import { $onePlus, $or, $zeroPlus, adfNode } from '@atlaskit/adf-schema-generator';
import { inlineContentGroup } from '../groups/inlineContentGroup';
import { inlineGroup } from '../groups/inlineGroup';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { extension } from './extension';
import { paragraph } from './paragraph';
import { unsupportedBlock } from './unsupportedBlock';

export const taskItem: ADFNode<[string], ADFCommonNodeSpec> = adfNode('taskItem');
export const taskList: ADFNode<[string], ADFCommonNodeSpec> = adfNode('taskList');
export const blockTaskItem: ADFNode<[string], ADFCommonNodeSpec> = adfNode('blockTaskItem');

const commonTaskItemProps = {
	defining: true,
	selectable: false,
	marks: [unsupportedMark, unsupportedNodeAttribute],
	allowAnyChildMark: true,

	attrs: {
		localId: {
			type: 'string' as const,
			default: '',
		},
		state: {
			type: 'enum' as const,
			values: ['TODO', 'DONE'],
			default: 'TODO',
		},
	},
};

taskItem.define({
	...commonTaskItemProps,
	content: [$zeroPlus($or(inlineGroup, inlineContentGroup))],
});

blockTaskItem.define({
	...commonTaskItemProps,
	marks: [unsupportedMark, unsupportedNodeAttribute],
	allowAnyChildMark: false, // Override the commonTaskItemProps setting
	contentMinItems: 1,
	content: [
		$or(
			paragraph.use('with_no_marks'),
			paragraph.use('with_font_size'),
			extension.use('with_marks'),
		),
		$zeroPlus(
			$or(
				paragraph.use('with_no_marks'),
				paragraph.use('with_font_size'),
				extension.use('with_marks'),
			),
		),
	],
});

taskList.define({
	defining: true,
	selectable: false,

	marks: [unsupportedMark, unsupportedNodeAttribute],

	attrs: {
		localId: {
			type: 'string',
			default: '',
		},
	},

	contentMinItems: 1,
	content: [
		$onePlus($or(taskItem, unsupportedBlock, blockTaskItem)),
		$zeroPlus($or(taskItem, taskList, unsupportedBlock, blockTaskItem)),
	],
});

export const taskListWithFlexibleFirstChild: ADFNode<
	[string, 'with_flexible_first_child'],
	ADFCommonNodeSpec & {
		contentMinItems: number;
		content: ADFNodeContentOneOrMoreSpec[];
		stage0: true;
	}
> = taskList.variant('with_flexible_first_child', {
	contentMinItems: 1,
	content: [$onePlus($or(taskItem, taskList, unsupportedBlock, blockTaskItem))],
	stage0: true,
});
