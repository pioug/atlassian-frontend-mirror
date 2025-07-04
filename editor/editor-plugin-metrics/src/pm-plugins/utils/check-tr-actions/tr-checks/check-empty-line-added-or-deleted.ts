import { type ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

import { ActionType, type DetailedReplaceStep, type TrAction } from '../types';

export const checkEmptyLineAddedOrDeleted = (
	step: ReplaceStep,
): TrAction<ActionType.EMPTY_LINE_ADDED_OR_DELETED> | undefined => {
	const {
		slice: { content },
		from,
		to,
	} = step as DetailedReplaceStep;

	const isEmptyLineDeleted = to - from === 2 && content.size === 0;

	if (isEmptyLineDeleted) {
		return { type: ActionType.EMPTY_LINE_ADDED_OR_DELETED };
	}

	let isEmptyLineAdded = false;
	content.forEach((node) => {
		isEmptyLineAdded = node.type.name === 'paragraph' && node.content.size === 0;
	});

	if (!isEmptyLineAdded) {
		return undefined;
	}
	return { type: ActionType.EMPTY_LINE_ADDED_OR_DELETED };
};
