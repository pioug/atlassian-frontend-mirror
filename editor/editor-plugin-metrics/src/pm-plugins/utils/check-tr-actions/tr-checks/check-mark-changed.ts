import { AddMarkStep, RemoveMarkStep, type Step } from '@atlaskit/editor-prosemirror/transform';

import { ActionType, type MarkChangeAction } from '../types';

export const checkMarkChanged = (step: Step): MarkChangeAction | undefined => {
	if (!(step instanceof AddMarkStep || step instanceof RemoveMarkStep)) {
		return undefined;
	}
	return {
		type: ActionType.CHANGING_MARK,
	};
};
