import { type ReplaceAroundStep, type ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

import { ActionType, type TrAction } from '../types';

export const checkListTypeNodeChanged = (
	step: ReplaceStep | ReplaceAroundStep,
):
	| TrAction<ActionType.INSERTING_NEW_LIST_TYPE_NODE | ActionType.UPDATING_NEW_LIST_TYPE_ITEM>
	| undefined => {
	const {
		slice: { content },
	} = step;
	const childCount = content.childCount;

	if (childCount < 1) {
		return undefined;
	}

	for (const node of content.content) {
		const isListTypeNode = [
			'decisionList',
			'decisionItem',
			'bulletList',
			'listItem',
			'orderedList',
			'taskList',
			'taskItem',
		].includes(node.type.name);
		if (isListTypeNode) {
			return childCount === 1
				? { type: ActionType.INSERTING_NEW_LIST_TYPE_NODE }
				: { type: ActionType.UPDATING_NEW_LIST_TYPE_ITEM };
		}
	}

	return undefined;
};
