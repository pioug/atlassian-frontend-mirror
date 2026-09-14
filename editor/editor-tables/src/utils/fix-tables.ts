import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import { changedDescendants } from './changed-descendants';
import { fixTable } from './fix-table';

export type ReportFixedTable = ({
	state,
	tr,
	reason,
}: {
	reason: string;
	state: EditorState;
	tr: Transaction;
}) => void;

// :: (EditorState, ?EditorState) → ?Transaction
// Inspect all tables in the given state's document and return a
// transaction that fixes them, if necessary. If `oldState` was
// provided, that is assumed to hold a previous, known-good state,
// which will be used to avoid re-scanning unchanged parts of the
// document.
export function fixTables(
	state: EditorState,
	oldState?: EditorState,
	reportFixedTable?: ReportFixedTable,
): Transaction | undefined {
	let tr: Transaction | undefined;
	const check = (node: Node, pos: number) => {
		if (node.type.spec.tableRole === 'table') {
			tr = fixTable(state, node, pos, tr, reportFixedTable);
		}
	};
	if (!oldState) {
		state.doc.descendants(check);
	} else if (oldState.doc !== state.doc) {
		changedDescendants(oldState.doc, state.doc, 0, check);
	}
	return tr;
}
