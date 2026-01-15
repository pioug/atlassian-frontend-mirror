import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

export function handleEditorFocus(view: EditorView | undefined): number | undefined | void {
	if (view?.hasFocus()) {
		return;
	}

	// Due to race conditions during editor lifecycle transitions (e.g. SPA route changes during opening or closing)
	// where the view (and its internal docView) may have been destroyed, the timeout callback may fire on a stale view.
	// Bail out in that scenario to prevent operating on an unmounted view.
	if (view?.isDestroyed) {
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

	// If not mocked properly in tests, getRangeAt may not exist.
	const range = domSelection.getRangeAt?.(0);
	if (!range) {
		return;
	}

	// if selection is outside editor focus and exit
	if (view && range?.startContainer.contains(view.dom)) {
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
}
