import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { GapCursorSelection } from '../selection';
import type { Side } from '../Side';

export function setGapCursorSelection(view: EditorView, pos: number, side: Side): void {
	const { state } = view;
	view.dispatch(state.tr.setSelection(new GapCursorSelection(state.doc.resolve(pos), side)));
}
