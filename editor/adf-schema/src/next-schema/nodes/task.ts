import type { ADFCommonNodeSpec, ADFNode} from '@atlaskit/adf-schema-generator';
import { $onePlus, $or, $zeroPlus, adfNode } from '@atlaskit/adf-schema-generator';
import { inlineContentGroup } from '../groups/inlineContentGroup';
import { inlineGroup } from '../groups/inlineGroup';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { unsupportedBlock } from './unsupportedBlock';
import { paragraph } from './paragraph';
import { extension } from './extension';

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
		$or(paragraph.use('with_no_marks'), extension.use('with_marks')),
		$zeroPlus($or(paragraph.use('with_no_marks'), extension.use('with_marks'))),
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

taskList.variant('flexible_first_child', {
	contentMinItems: 1,
	content: [$onePlus($or(taskItem, taskList, unsupportedBlock, blockTaskItem))],
	stage0: true,
});
