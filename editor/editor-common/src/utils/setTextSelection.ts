import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export function setTextSelection(view: EditorView, anchor: number, head?: number): void {
	const { state, dispatch } = view;
	const tr = state.tr.setSelection(TextSelection.create(state.doc, anchor, head));
	dispatch(tr);
}
