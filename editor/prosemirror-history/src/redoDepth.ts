import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { historyKey } from './historyKey';

/// The amount of redoable events available in a given editor state.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function redoDepth(state: EditorState): any {
	const hist = historyKey.getState(state);
	return hist ? hist.undone.eventCount : 0;
}
