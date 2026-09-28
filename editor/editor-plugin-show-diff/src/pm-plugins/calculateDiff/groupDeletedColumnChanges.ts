import type { Change } from 'prosemirror-changeset';

import { areNodesEqualIgnoreAttrs } from '@atlaskit/editor-common/utils/document';
import { Fragment, type Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Mapping } from '@atlaskit/editor-prosemirror/transform';
import { TableMap } from '@atlaskit/editor-tables/table-map';

type LocatedTable = { node: PMNode; pos: number };

export type ColumnAwareChange = Change & { deletedColumns?: number[] };

type TableChangePlan = {
	replacedChanges: readonly Change[];
	tableChange: ColumnAwareChange;
};

export const CELL_CONTENT_OFFSET = 2;

const tablesIn = (doc: PMNode): LocatedTable[] => {
	const tables: LocatedTable[] = [];
	doc.descendants((node, pos) => {
		if (node.type.name === 'table') {
			tables.push({ node, pos });
			return false;
		}
		return true;
	});
	return tables;
};

const tableEnd = (table: LocatedTable): number => table.pos + table.node.nodeSize;

const documentsDifferOnlyByTable = (
	originalDoc: PMNode,
	newDoc: PMNode,
	before: LocatedTable,
	after: LocatedTable,
): boolean => {
	try {
		return originalDoc
			.replace(before.pos, tableEnd(before), new Slice(Fragment.from(after.node), 0, 0))
			.eq(newDoc);
	} catch {
		return false;
	}
};

const columnOffsets = (map: TableMap, table: PMNode): number[] =>
	Array.from({ length: map.width }, (_, column) => map.positionAt(0, column, table));

const positionMatchedColumns = ({
	before,
	after,
	afterToBefore,
	beforeOffsets,
}: {
	after: LocatedTable;
	afterToBefore: Mapping;
	before: LocatedTable;
	beforeOffsets: number[];
}): Set<number> => {
	const afterMap = TableMap.get(after.node);
	const surviving = new Set<number>();

	for (let column = 0; column < afterMap.width; column++) {
		const offset = afterMap.positionAt(0, column, after.node);
		const mapped = afterToBefore.mapResult(after.pos + CELL_CONTENT_OFFSET + offset);
		const beforeColumn = beforeOffsets.indexOf(mapped.pos - before.pos - CELL_CONTENT_OFFSET);
		if (mapped.deleted || beforeColumn === -1) {
			return new Set();
		}
		surviving.add(beforeColumn);
	}

	return surviving;
};

const headerLocalIds = (table: LocatedTable): Array<string | undefined> =>
	(table.node.firstChild?.children ?? []).map((cell) => cell.attrs.localId ?? undefined);

/**
 * Cells keep their `localId` when a column is deleted, so the first row's ids name each remaining
 * column even when the steps replaced the whole table. Missing or repeated ids, such as in content
 * pasted from elsewhere, cannot name a column.
 */
const localIdMatchedColumns = (
	before: LocatedTable,
	after: LocatedTable,
): Set<number> | undefined => {
	const beforeIds = headerLocalIds(before);
	if (beforeIds.some((id) => !id) || new Set(beforeIds).size !== beforeIds.length) {
		return undefined;
	}

	const surviving = new Set<number>();
	let previousColumn = -1;
	for (const id of headerLocalIds(after)) {
		const column = id ? beforeIds.indexOf(id) : -1;
		if (column <= previousColumn) {
			return undefined;
		}
		surviving.add(column);
		previousColumn = column;
	}
	return surviving;
};

const IGNORED_CELL_ATTRS = ['localId', 'colwidth'];

/** Rows may also have been deleted, so the remaining cells only need to appear in order. */
const isColumnKept = (
	before: LocatedTable,
	beforeColumn: number,
	after: LocatedTable,
	afterColumn: number,
): boolean => {
	let beforeRow = 0;
	return after.node.children.every((afterRow) => {
		const afterCell = afterRow.maybeChild(afterColumn);
		while (beforeRow < before.node.childCount) {
			const beforeCell = before.node.child(beforeRow++).maybeChild(beforeColumn);
			if (
				afterCell &&
				beforeCell &&
				areNodesEqualIgnoreAttrs(beforeCell, afterCell, IGNORED_CELL_ATTRS)
			) {
				return true;
			}
		}
		return false;
	});
};

/**
 * Pairs each remaining column with an equal original column, keeping their order, and takes each
 * pair from the `direction` end first. Returns the original column of each remaining column.
 */
const pairColumnsInOrder = (
	beforeWidth: number,
	afterWidth: number,
	isMatch: (beforeColumn: number, afterColumn: number) => boolean,
	direction: 'left' | 'right',
): number[] | undefined => {
	const step = direction === 'left' ? 1 : -1;
	const pairing: number[] = [];
	let beforeColumn = direction === 'left' ? 0 : beforeWidth - 1;
	let afterColumn = direction === 'left' ? 0 : afterWidth - 1;

	for (; afterColumn >= 0 && afterColumn < afterWidth; afterColumn += step) {
		while (beforeColumn >= 0 && beforeColumn < beforeWidth && !isMatch(beforeColumn, afterColumn)) {
			beforeColumn += step;
		}
		if (beforeColumn < 0 || beforeColumn >= beforeWidth) {
			return undefined;
		}
		pairing.push(beforeColumn);
		beforeColumn += step;
	}

	return direction === 'left' ? pairing : pairing.reverse();
};

/**
 * For tables whose cells have no usable ids, such as content created before cells had ids. Every
 * valid pairing of remaining columns to original ones lies between the leftmost and the rightmost
 * pairing, so the columns are only reported when those two agree. Otherwise, such as when several
 * original columns are identical, which of them were removed cannot be known.
 */
const uniquelyContentMatchedColumns = (
	before: LocatedTable,
	after: LocatedTable,
	beforeWidth: number,
	afterWidth: number,
): Set<number> | undefined => {
	const isMatch = (beforeColumn: number, afterColumn: number) =>
		isColumnKept(before, beforeColumn, after, afterColumn);
	const leftmost = pairColumnsInOrder(beforeWidth, afterWidth, isMatch, 'left');
	const rightmost = pairColumnsInOrder(beforeWidth, afterWidth, isMatch, 'right');

	if (!leftmost || !rightmost || leftmost.some((column, index) => column !== rightmost[index])) {
		return undefined;
	}
	return new Set(leftmost);
};

const findDeletedColumns = (
	before: LocatedTable,
	after: LocatedTable,
	afterToBefore: Mapping,
): number[] => {
	const beforeMap = TableMap.get(before.node);
	const afterMap = TableMap.get(after.node);
	// Merged or malformed tables do not have reliable column indices.
	if (
		beforeMap.hasMergedCells() ||
		afterMap.hasMergedCells() ||
		beforeMap.problems ||
		afterMap.problems
	) {
		return [];
	}

	const beforeOffsets = columnOffsets(beforeMap, before.node);
	const positionMatched = positionMatchedColumns({ before, after, afterToBefore, beforeOffsets });
	const surviving =
		positionMatched.size === afterMap.width
			? positionMatched
			: (localIdMatchedColumns(before, after) ??
				uniquelyContentMatchedColumns(before, after, beforeMap.width, afterMap.width));

	if (!surviving) {
		return [];
	}

	return beforeOffsets.flatMap((_, column) => (surviving.has(column) ? [] : [column]));
};

const findCounterpart = ({
	table,
	index,
	originalTables,
	newTables,
	mapping,
}: {
	index: number;
	mapping: Mapping;
	newTables: LocatedTable[];
	originalTables: LocatedTable[];
	table: LocatedTable;
}): LocatedTable | undefined => {
	const from = mapping.map(table.pos, -1);
	const to = mapping.map(tableEnd(table), 1);
	const inside = mapping.mapResult(table.pos + 1);

	const candidates = newTables.filter((candidate) =>
		inside.deleted
			? candidate.pos >= from && tableEnd(candidate) <= to
			: candidate.pos < inside.pos && inside.pos < tableEnd(candidate),
	);
	if (candidates.length === 1) {
		return candidates[0];
	}
	return originalTables.length === newTables.length ? newTables[index] : undefined;
};

const orient = ({
	table,
	counterpart,
	mapping,
	isInverted,
}: {
	counterpart: LocatedTable;
	isInverted: boolean;
	mapping: Mapping;
	table: LocatedTable;
}): { after: LocatedTable; afterToBefore: Mapping; before: LocatedTable } => ({
	before: isInverted ? counterpart : table,
	after: isInverted ? table : counterpart,
	afterToBefore: (isInverted ? mapping.invert() : mapping).invert(),
});

const changesInTable = (changes: readonly Change[], table: LocatedTable): Change[] =>
	changes.filter((change) => change.fromA < tableEnd(table) && change.toA > table.pos);

const isNarrowingSafe = ({
	replacedChanges,
	table,
	counterpart,
	originalDoc,
	newDoc,
}: {
	counterpart: LocatedTable;
	newDoc: PMNode;
	originalDoc: PMNode;
	replacedChanges: readonly Change[];
	table: LocatedTable;
}): boolean => {
	const staysInside = replacedChanges.every(
		(change) =>
			change.fromA >= table.pos &&
			change.toA <= tableEnd(table) &&
			change.fromB >= counterpart.pos &&
			change.toB <= tableEnd(counterpart),
	);
	return staysInside || documentsDifferOnlyByTable(originalDoc, newDoc, table, counterpart);
};

const planTableChange = ({
	table,
	index,
	originalTables,
	newTables,
	changes,
	originalDoc,
	newDoc,
	mapping,
	isInverted,
}: {
	changes: readonly Change[];
	index: number;
	isInverted: boolean;
	mapping: Mapping;
	newDoc: PMNode;
	newTables: LocatedTable[];
	originalDoc: PMNode;
	originalTables: LocatedTable[];
	table: LocatedTable;
}): TableChangePlan | undefined => {
	const counterpart = findCounterpart({ table, index, originalTables, newTables, mapping });
	if (!counterpart) {
		return undefined;
	}

	const { before, after, afterToBefore } = orient({ table, counterpart, mapping, isInverted });
	if (TableMap.get(before.node).width <= TableMap.get(after.node).width) {
		return undefined;
	}

	const replacedChanges = changesInTable(changes, table);
	if (!replacedChanges.length) {
		return undefined;
	}
	if (!isNarrowingSafe({ replacedChanges, table, counterpart, originalDoc, newDoc })) {
		return undefined;
	}

	const spans = replacedChanges.flatMap((change) => [...change.deleted, ...change.inserted]);
	return {
		replacedChanges,
		tableChange: {
			deletedColumns: findDeletedColumns(before, after, afterToBefore),
			fromA: table.pos,
			toA: tableEnd(table),
			fromB: counterpart.pos,
			toB: tableEnd(counterpart),
			deleted: spans,
			inserted: spans,
		},
	};
};

/** Groups a deleted column's cell changes into one whole-table change. */
export const groupDeletedColumnChanges = (
	changes: readonly Change[],
	originalDoc: PMNode,
	newDoc: PMNode,
	mapping: Mapping,
	isInverted: boolean,
): ColumnAwareChange[] => {
	const originalTables = tablesIn(originalDoc);
	const newTables = tablesIn(newDoc);
	const plans: TableChangePlan[] = [];
	const replaced = new Set<Change>();

	originalTables.forEach((table, index) => {
		const plan = planTableChange({
			table,
			index,
			originalTables,
			newTables,
			changes: changes.filter((change) => !replaced.has(change)),
			originalDoc,
			newDoc,
			mapping,
			isInverted,
		});
		if (!plan) {
			return;
		}
		plans.push(plan);
		plan.replacedChanges.forEach((change) => replaced.add(change));
	});

	if (!plans.length) {
		return [...changes];
	}

	return [
		...changes.filter((change) => !replaced.has(change)),
		...plans.map((plan) => plan.tableChange),
	].sort((left, right) => left.fromB - right.fromB);
};
