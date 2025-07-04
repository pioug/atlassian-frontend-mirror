import { type ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

import { ActionType, type StatusChangeAction } from '../types';

export const checkStatusChanged = (step: ReplaceStep): StatusChangeAction | undefined => {
	const { slice } = step;
	const firstChild = slice.content.firstChild;
	if (!firstChild) {
		return undefined;
	}

	// Get statusId so that we can track whether edits are performed on same status node
	return firstChild.type.name === 'status'
		? {
				type: ActionType.UPDATING_STATUS,
				extraData: { statusId: firstChild.attrs.localId },
			}
		: undefined;
};
