import { type ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

import { ActionType, type DetailedReplaceStep, type TrAction } from '../types';

export const checkDeletingContent = (
	step: ReplaceStep,
): TrAction<ActionType.DELETING_CONTENT> | undefined => {
	const {
		slice: { content },
		from,
		to,
	} = step as DetailedReplaceStep;

	const isDeletingContent = to !== from && content.childCount === 0;
	if (!isDeletingContent) {
		return undefined;
	}
	return { type: ActionType.DELETING_CONTENT };
};
