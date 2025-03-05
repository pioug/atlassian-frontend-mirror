import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { metricsKey } from '../../../main';
import { ActionType, type TrAction } from '../types';

const UI_EVENT = 'uiEvent';
const PASTE_EVENT = 'paste';

export const checkContentPastedOrMoved = (
	tr: ReadonlyTransaction,
): TrAction<ActionType.MOVING_CONTENT | ActionType.PASTING_CONTENT> | undefined => {
	const isContentMoved = tr.getMeta(metricsKey)?.contentMoved;

	const isContentPasted = tr.getMeta(UI_EVENT) === PASTE_EVENT;

	if (isContentMoved) {
		return { type: ActionType.MOVING_CONTENT };
	}

	if (isContentPasted) {
		return { type: ActionType.PASTING_CONTENT };
	}

	return undefined;
};
