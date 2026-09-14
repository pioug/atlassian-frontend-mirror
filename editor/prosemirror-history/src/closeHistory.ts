import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { closeHistoryKey } from './closeHistoryKey';

/// Set a flag on the given transaction that will prevent further steps
/// from being appended to an existing history event (so that they

/// require a separate undo command to undo).
export function closeHistory(tr: Transaction): Transaction {
	return tr.setMeta(closeHistoryKey, true);
}
