import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

import { type DetailedReplaceStep, type TrAction, ActionType } from '../types';

export const checkTextInput = (step: ReplaceStep): TrAction<ActionType.TEXT_INPUT> | undefined => {
	const {
		slice: { content },
		from,
		to,
	} = step as DetailedReplaceStep;

	const node = content.firstChild;

	const isAddingCharacter =
		from === to && content.childCount === 1 && !!node && !!node.text && node.text.length === 1;

	const isDeletingCharacter = to - from === 1 && content.childCount === 0;

	const isTextInput = isAddingCharacter || isDeletingCharacter;
	if (!isTextInput) {
		return undefined;
	}
	return { type: ActionType.TEXT_INPUT };
};
