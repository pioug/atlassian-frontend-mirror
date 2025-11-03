import React from 'react';

import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

export function handleEditorFocus(view: EditorView | undefined): number | undefined | void {
	if (view?.hasFocus()) {
		return;
	}

	/**
	 * If startTransition is available (in React 18),
	 * don't use setTimeout as startTransition will be used in ReactEditorViewNext.
	 * setTimeout(fn, 0) will not defer the focus reliably in React 18 with
	 * concurrent rendering.
	 */
	const react16OnlySetTimeout =
		(
			React as unknown as {
				startTransition?: (fn: () => void) => void;
			}
		)?.startTransition && fg('platform_editor_react_18_autofocus_fix')
			? (fn: () => void) => fn()
			: (fn: () => void) => window.setTimeout(fn, 0);

	return react16OnlySetTimeout(() => {
		// Due to race conditions during editor lifecycle transitions (e.g. SPA route changes during opening or closing)
		// where the view (and its internal docView) may have been destroyed, the timeout callback may fire on a stale view.
		// Bail out in that scenario to prevent operating on an unmounted view.
		if (view?.isDestroyed) {
			return;
		}

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
	});
}
