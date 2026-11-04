import { useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { getDocument } from '@atlaskit/browser-apis';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { redo } from '@atlaskit/prosemirror-history/redo';
import { undo } from '@atlaskit/prosemirror-history/undo';

const MENU_SELECTOR = '[role="menu"]';

/**
 * Keeps undo and redo working while a toolbar menu has focus, so a toggle made from the menu can
 * be undone without closing it. When the editor has focus, its own keymap handles the shortcut.
 */
export const useUndoRedoWhileMenuOpen = (editorView: EditorView | null): void => {
	useEffect(() => {
		const doc = getDocument();
		if (!editorView || !doc) {
			return;
		}

		return bind(doc, {
			type: 'keydown',
			listener: (event: KeyboardEvent) => {
				if (
					editorView.hasFocus() ||
					!(event.target instanceof Element) ||
					!event.target.closest(MENU_SELECTOR)
				) {
					return;
				}

				const key = event.key.toLowerCase();
				const isMetaCtrl = event.metaKey || event.ctrlKey;
				const isUndo = isMetaCtrl && key === 'z' && !event.shiftKey;
				const isRedo = isMetaCtrl && (key === 'y' || (key === 'z' && event.shiftKey));
				if (!isUndo && !isRedo) {
					return;
				}

				event.preventDefault();
				event.stopPropagation();
				(isUndo ? undo : redo)(editorView.state, editorView.dispatch);
			},
		});
	}, [editorView]);
};
