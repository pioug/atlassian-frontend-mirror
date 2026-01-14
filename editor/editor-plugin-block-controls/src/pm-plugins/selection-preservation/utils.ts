import type {
	ReadonlyTransaction,
	Selection,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';

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
 * Triggers a DOM selection sync by resetting the current native selection range
 * only if it is out of sync with the provided ProseMirror selection state.
 *
 * This is a necessary workaround to ensure the browser's native selection state
 * stays in sync with the preserved selection, particularly after transactions
 * that shift document content.
 *
 * @param selection The current ProseMirror selection state to compare against.
 */
export const syncDOMSelection = (selection: Selection): void => {
	const domSelection = window.getSelection();
	const domRange =
		domSelection && domSelection.rangeCount === 1 && domSelection.getRangeAt(0).cloneRange();

	const isOutOfSync =
		domRange && (selection.from !== domRange.startOffset || selection.to !== domRange.endOffset);

	if (isOutOfSync) {
		// Force the DOM selection to refresh, setting it to the same range
		// This will trigger ProseMirror to re-apply its selection logic based on the current state
		domSelection.removeAllRanges();
		domSelection.addRange(domRange);
	}
};
