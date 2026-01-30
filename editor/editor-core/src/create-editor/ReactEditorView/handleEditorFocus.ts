import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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
	try {
		if (view && range?.startContainer.contains(view.dom)) {
			view.focus();
			return;
		}
	} catch (error) {
		// If we get a SecurityError-type DOMException here, then we probably just tried to
		// access a cross-origin iframe's contents. In that case, we can ignore the error and
		// just reasonably assume the selection is outside the editor, since we can't access it.
		if (
			error instanceof DOMException &&
			error.name === 'SecurityError' &&
			expValEquals('platform_editor_fix_cross_origin_editor_focus', 'isEnabled', true)
		) {
			if (view) {
				view.focus();
				return;
			}
		} else {
			// re-throw other unexpected errors
			throw error;
		}
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
