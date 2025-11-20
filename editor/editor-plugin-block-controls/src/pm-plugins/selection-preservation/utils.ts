import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';

import { selectionPreservationPluginKey } from './plugin-key';
import type { SelectionPreservationMeta } from './types';

/**
 * Detects if any of the transactions include user-driven selection changes.
 *
 * @param transactions The list of transactions to check.
 * @returns True if any transaction includes a user-driven selection change, otherwise false.
 */
export const hasUserSelectionChange = (transactions: readonly Transaction[]) => {
	return transactions.some((tr) => tr.getMeta('pointer') && tr.selectionSet);
};

export const getSelectionPreservationMeta = (tr: Transaction | ReadonlyTransaction) => {
	return tr.getMeta(selectionPreservationPluginKey) as SelectionPreservationMeta | undefined;
};
