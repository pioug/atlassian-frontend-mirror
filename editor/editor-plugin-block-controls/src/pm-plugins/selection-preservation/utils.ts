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
 * Checks if the current selection is within a code block.
 *
 * @param selection The current selection to check.
 * @returns True if the selection is within a code block, otherwise false.
 */
export const isSelectionWithinCodeBlock = ({ $from, $to }: Selection): boolean => {
	return $from.sameParent($to) && $from.parent.type.name === 'codeBlock';
};
