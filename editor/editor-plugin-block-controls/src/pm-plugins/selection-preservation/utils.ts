import { getDocument } from '@atlaskit/browser-apis';
import type {
	ReadonlyTransaction,
	Selection,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { selectionPreservationPluginKey } from './plugin-key';
import type { SelectionPreservationMeta } from './types';

/**
 * Detects if any of the transactions include user-driven selection changes.
 *
 * @param transactions The list of transactions to check.
 * @returns True if any transaction includes a user-driven selection change, otherwise false.
 */
export const hasUserSelectionChange = (transactions: readonly Transaction[]): boolean => {
	return transactions.some((tr) => tr.getMeta('pointer') && tr.selectionSet);
};

export const getSelectionPreservationMeta = (tr: Transaction | ReadonlyTransaction) => {
	return tr.getMeta(selectionPreservationPluginKey) as SelectionPreservationMeta | undefined;
};

/**
 * Compares two selections for equality based on their from and to positions.
 *
 * @param a The first selection to compare.
 * @param b The second selection to compare.
 * @returns True if both selections are equal, otherwise false.
 */
export const compareSelections = (a?: Selection, b?: Selection): boolean => {
	return (!a && !b) || (!!a && !!b && a.eq(b));
};

/**
 * Forces the browser's native selection to match ProseMirror's selection state.
 *
 * This is necessary when the editor doesn't have focus (e.g., when block menu is open)
 * but we still need to update the visual selection after moving nodes. Without this,
 * the browser's native selection remains at the old position, causing ghost highlighting.
 *
 * @param selection The current ProseMirror selection state to sync to DOM.
 * @param view The EditorView instance used to convert ProseMirror positions to DOM positions (when feature flag is enabled).
 */
export const syncDOMSelection = (selection: Selection, view?: EditorView): void => {
	// [FEATURE FLAG: platform_editor_selection_sync_fix]
	// When enabled, uses improved DOM selection syncing with EditorView.
	// To clean up: remove the if-else block, remove the optional view parameter,
	// make view required, and keep only the flag-on behavior.
	if (view && fg('platform_editor_selection_sync_fix')) {
		try {
			const domSelection = window.getSelection();
			if (!domSelection) {
				return;
			}

			const doc = getDocument();
			if (!doc) {
				return;
			}

			// Convert ProseMirror selection to DOM selection using view.domAtPos
			const anchor = view.domAtPos(selection.anchor);
			const head = view.domAtPos(selection.head);

			if (!anchor || !head) {
				return;
			}

			// Create a new DOM range from the ProseMirror selection
			const range = doc.createRange();
			range.setStart(anchor.node, anchor.offset);
			range.setEnd(head.node, head.offset);

			// Update the DOM selection to match ProseMirror's selection
			domSelection.removeAllRanges();
			domSelection.addRange(range);
		} catch {
			// Silently fail if DOM selection sync fails
			// This can happen if positions are invalid or DOM hasn't updated yet
		}
	} else {
		// OLD BEHAVIOR (to be removed when flag is cleaned up)
		// Only checked if selection was out of sync using incorrect offset comparison
		const domSelection = window.getSelection();
		const domRange =
			domSelection && domSelection.rangeCount === 1 && domSelection.getRangeAt(0).cloneRange();

		const isOutOfSync =
			domRange && (selection.from !== domRange.startOffset || selection.to !== domRange.endOffset);

		if (isOutOfSync && domSelection && domRange) {
			// Force the DOM selection to refresh, setting it to the same range
			// This will trigger ProseMirror to re-apply its selection logic based on the current state
			domSelection.removeAllRanges();
			domSelection.addRange(domRange);
		}
	}
};
