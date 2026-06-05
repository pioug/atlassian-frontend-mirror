import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

export function setCellSelection(view: EditorView, anchor: number, head?: number): void {
	const { state, dispatch } = view;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	dispatch(state.tr.setSelection(CellSelection.create(state.doc, anchor, head) as any));
}
