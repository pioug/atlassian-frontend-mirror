import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import { fixTablesKey } from '../pm-plugins/plugin-key';
import { TableMap, TableProblemTypes } from '../table-map';
import type {
	TableProblemCollision,
	TableProblemLongRowspan,
	TableProblemMissing,
} from '../table-map';
import type { ReportFixedTable } from './fix-tables';
import { removeColSpan } from './remove-col-span';
import { tableNodeTypes } from './table-node-types';

// : (EditorState, Node, number, ?Transaction) → ?Transaction
// Fix the given table, if necessary. Will append to the transaction
// it was given, if non-null, or create a new one if necessary.
export function fixTable(
	state: EditorState,
	table: Node,
	tablePos: number,
	transaction?: Transaction,
	reportFixedTable?: ReportFixedTable,
): Transaction | undefined {
	let tr = transaction;
	const map = TableMap.get(table);
	if (!map.problems) {
		return tr;
	}
	if (!tr) {
		tr = state.tr;
	}

	// Track which rows we must add cells to, so that we can adjust that
	// when fixing collisions.
	const mustAdd: number[] = [];
	for (let i = 0; i < map.height; i++) {
		mustAdd.push(0);
	}

	for (let i = 0; i < map.problems.length; i++) {
		const prob = map.problems[i];

		if (reportFixedTable) {
			reportFixedTable({ state, tr, reason: prob.type || 'unknown' });
		}

		if (prob.type === TableProblemTypes.COLLISION) {
			const collision = prob as TableProblemCollision;
			const cell = table.nodeAt(prob.pos);
			if (!cell) {
				throw new Error(`fixTable: unable to find cell at pos ${prob.pos}`);
			}
			for (let j = 0; j < cell.attrs.rowspan; j++) {
				mustAdd[collision.row + j] += collision.n;
			}
			tr.setNodeMarkup(
				tr.mapping.map(tablePos + 1 + prob.pos),
				undefined,
				removeColSpan(cell.attrs, cell.attrs.colspan - collision.n, collision.n),
			);
		} else if (prob.type === TableProblemTypes.MISSING) {
			const missing = prob as TableProblemMissing;
			mustAdd[missing.row] += missing.n;
		} else if (prob.type === TableProblemTypes.OVERLONG_ROWSPAN) {
			const overlong = prob as TableProblemLongRowspan;
			const cell = table.nodeAt(overlong.pos);
			if (!cell) {
				throw new Error(`fixTable: unable to find cell at pos ${prob.pos}`);
			}
			tr.setNodeMarkup(tr.mapping.map(tablePos + 1 + overlong.pos), undefined, {
				...cell.attrs,
				rowspan: cell.attrs.rowspan - overlong.n,
			});
		} else if (prob.type === TableProblemTypes.COLWIDTH_MISMATCH) {
			const cell = table.nodeAt(prob.pos);
			if (!cell) {
				throw new Error(`fixTable: unable to find cell at pos ${prob.pos}`);
			}
			tr.setNodeMarkup(tr.mapping.map(tablePos + 1 + prob.pos), undefined, {
				...cell.attrs,
				colwidth: prob.colwidth,
			});
		}
	}
	let first;
	let last;
	for (let i = 0; i < mustAdd.length; i++) {
		if (mustAdd[i]) {
			if (first == null) {
				first = i;
			}
			last = i;
		}
	}
	// Add the necessary cells, using a heuristic for whether to add the
	// cells at the start or end of the rows (if it looks like a 'bite'
	// was taken out of the table, add cells at the start of the row
	// after the bite. Otherwise add them at the end).
	for (let i = 0, pos = tablePos + 1; i < map.height; i++) {
		const row = table.child(i);
		const end = pos + row.nodeSize;
		const add = mustAdd[i];
		if (add > 0) {
			let tableNodeType = 'cell';
			if (row.firstChild) {
				tableNodeType = row.firstChild.type.spec.tableRole;
			}
			const nodes: Node[] = [];
			for (let j = 0; j < add; j++) {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				nodes.push(tableNodeTypes(state.schema)[tableNodeType].createAndFill()!);
			}
			const side = (i === 0 || first === i - 1) && last === i ? pos + 1 : end - 1;
			tr.insert(tr.mapping.map(side), nodes);
		}
		pos = end;
	}
	return tr.setMeta(fixTablesKey, { fixTables: true });
}
