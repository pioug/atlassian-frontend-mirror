import { AddMarkStep, RemoveMarkStep } from '@atlaskit/editor-prosemirror/transform';
import type { Step } from '@atlaskit/editor-prosemirror/transform';

import { ActionType } from '../types';
import type { MarkChangeAction } from '../types';

export const checkMarkChanged = (step: Step): MarkChangeAction | undefined => {
	if (!(step instanceof AddMarkStep || step instanceof RemoveMarkStep)) {
		return undefined;
	}
	return {
		type: ActionType.CHANGING_MARK,
	};
};
