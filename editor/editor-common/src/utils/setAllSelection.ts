import { AllSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export function setAllSelection(view: EditorView): void {
	const { state, dispatch } = view;
	const tr = state.tr.setSelection(new AllSelection(view.state.doc));
	dispatch(tr);
}
