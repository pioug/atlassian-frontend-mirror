import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { historyKey } from './historyKey';

/// The amount of undoable events available in a given state.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function undoDepth(state: EditorState): any {
	const hist = historyKey.getState(state);
	return hist ? hist.done.eventCount : 0;
}
