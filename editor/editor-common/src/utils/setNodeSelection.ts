import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const setNodeSelection = (view: EditorView, pos: number): void => {
	const { state, dispatch } = view;

	if (!isFinite(pos)) {
		return;
	}

	const tr = state.tr.setSelection(NodeSelection.create(state.doc, pos));
	dispatch(tr);
};
