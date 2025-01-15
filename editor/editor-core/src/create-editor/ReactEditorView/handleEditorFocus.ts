import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

export function handleEditorFocus(view: EditorView | null): number | undefined {
	if (view?.hasFocus()) {
		return;
	}

	return window.setTimeout(() => {
		if (view?.hasFocus()) {
			return;
		}
		if (!window.getSelection) {
			view?.focus();
			return;
		}
		const domSelection = window.getSelection();
		if (!domSelection || domSelection.rangeCount === 0) {
			view?.focus();
			return;
		}
		const range = domSelection.getRangeAt(0);
		// if selection is outside editor focus and exit
		if (view && range.startContainer.contains(view.dom)) {
			view.focus();
			return;
		}
		// set cursor/selection and focus
		const anchor = view?.posAtDOM(range.startContainer, range.startOffset);
		const head = view?.posAtDOM(range.endContainer, range.endOffset);
		// if anchor or head < 0 focus and exit
		if ((anchor && anchor < 0) || (head && head < 0)) {
			view?.focus();
			return;
		}
		if (view && anchor) {
			const selection = TextSelection.create(view.state.doc, anchor, head);
			const tr = view.state.tr.setSelection(selection);
			view.dispatch(tr);
			view.focus();
		}
	}, 0);
}
