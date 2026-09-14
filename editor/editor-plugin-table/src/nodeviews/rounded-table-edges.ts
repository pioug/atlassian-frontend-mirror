import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { TableMap } from '@atlaskit/editor-tables/table-map';
type RoundedTableCellEdgeState = {
	reachesBottom: boolean;
	reachesLeft: boolean;
	reachesRight: boolean;
	reachesTop: boolean;
};

const roundedTableCellEdgeStateCache = new WeakMap<
	PmNode,
	Map<number, RoundedTableCellEdgeState>
>();

const addEdgeState = (
	edgeStates: Map<number, RoundedTableCellEdgeState>,
	offset: number,
	edge: keyof RoundedTableCellEdgeState,
): void => {
	let edgeState = edgeStates.get(offset);
	if (!edgeState) {
		edgeState = {
			reachesTop: false,
			reachesBottom: false,
			reachesLeft: false,
			reachesRight: false,
		};
		edgeStates.set(offset, edgeState);
	}
	edgeState[edge] = true;
};

/**
 * Returns the rounded-edge membership for a cell offset.
 *
 * The first lookup for a table scans only the TableMap's four borders and caches edge cells.
 * Interior cells have no cache entry and require no DOM attributes. Subsequent cell nodeview
 * constructors perform an O(1) lookup. The cache is keyed by the immutable table node, so
 * structural document changes naturally create a fresh entry.
 */
export const getRoundedTableCellEdgeState = (
	tableNode: PmNode,
	cellOffset: number,
): RoundedTableCellEdgeState | undefined => {
	let edgeStates = roundedTableCellEdgeStateCache.get(tableNode);
	if (!edgeStates) {
		const { width, height, map } = TableMap.get(tableNode);
		edgeStates = new Map();

		for (let column = 0; column < width; column++) {
			addEdgeState(edgeStates, map[column], 'reachesTop');
			addEdgeState(edgeStates, map[(height - 1) * width + column], 'reachesBottom');
		}
		for (let row = 0; row < height; row++) {
			addEdgeState(edgeStates, map[row * width], 'reachesLeft');
			addEdgeState(edgeStates, map[row * width + width - 1], 'reachesRight');
		}

		roundedTableCellEdgeStateCache.set(tableNode, edgeStates);
	}

	return edgeStates.get(cellOffset);
};

const setDataAttr = (cell: HTMLTableCellElement, attr: string, value: boolean): void => {
	const hasAttr = cell.hasAttribute(attr);
	if (value && !hasAttr) {
		cell.setAttribute(attr, 'true');
	} else if (!value && hasAttr) {
		cell.removeAttribute(attr);
	}
};

/**
 * Refreshes the `data-reaches-{top,bottom,left,right}` attributes used by CSS to round
 * the table's corner cells (including merged cells that span to an edge).
 *
 * Edge membership is derived directly from the table map's border rows/columns: a cell
 * reaches an edge iff its offset appears in the corresponding border slice (this naturally
 * accounts for rowspan/colspan cells, whose offset is repeated across every grid slot they
 * cover). This is O(cells) overall, versus O(cells^2) when calling findCell per cell.
 */
const refreshRoundedTableEdgeAttrs = (table: HTMLTableElement, tableNode: PmNode): void => {
	try {
		const tableMap = TableMap.get(tableNode);
		const { width, height, map } = tableMap;
		const cells = Array.from(table.rows).flatMap((row) => Array.from(row.cells));
		const cellOffsets = Array.from(new Set(map));

		const topOffsets = new Set<number>();
		const bottomOffsets = new Set<number>();
		const leftOffsets = new Set<number>();
		const rightOffsets = new Set<number>();

		for (let col = 0; col < width; col++) {
			topOffsets.add(map[col]);
			bottomOffsets.add(map[(height - 1) * width + col]);
		}
		for (let row = 0; row < height; row++) {
			leftOffsets.add(map[row * width]);
			rightOffsets.add(map[row * width + width - 1]);
		}

		cellOffsets.forEach((cellOffset, cellIndex) => {
			const cell = cells[cellIndex];
			if (!cell) {
				return;
			}

			setDataAttr(cell, 'data-reaches-top', topOffsets.has(cellOffset));
			setDataAttr(cell, 'data-reaches-bottom', bottomOffsets.has(cellOffset));
			setDataAttr(cell, 'data-reaches-left', leftOffsets.has(cellOffset));
			setDataAttr(cell, 'data-reaches-right', rightOffsets.has(cellOffset));
		});
	} catch {
		// Table structure can be transient while ProseMirror normalises transactions.
		// Keep existing edge attrs if the current shape cannot be mapped safely.
	}
};

/**
 * Builds a lightweight signature of the cells sitting on the table's four borders, using
 * their immutable ProseMirror node references. Top and bottom rows are visited in full;
 * interior rows contribute only their first and last cells, making this O(rows + columns).
 */
const getPerimeterTableEdgeSignature = (tableNode: PmNode): PmNode[] => {
	const edgeCells: PmNode[] = [];
	const lastRowIndex = tableNode.childCount - 1;

	tableNode.forEach((row, _rowOffset, rowIndex) => {
		if (rowIndex === 0 || rowIndex === lastRowIndex) {
			row.forEach((cell) => {
				edgeCells.push(cell);
			});
			return;
		}

		if (row.firstChild) {
			edgeCells.push(row.firstChild);
		}
		if (row.childCount > 1 && row.lastChild) {
			edgeCells.push(row.lastChild);
		}
	});

	return edgeCells;
};

const tableEdgeSignaturesDiffer = (prev: PmNode[] | undefined, next: PmNode[]): boolean => {
	if (!prev || prev.length !== next.length) {
		return true;
	}
	for (let i = 0; i < prev.length; i++) {
		if (prev[i] !== next[i]) {
			return true;
		}
	}
	return false;
};

/**
 * Keeps a table's rounded-corner edge attributes in sync as its shape changes.
 *
 * Each TableCell node view refreshes its own edge attrs when its cell attrs change. However,
 * when the table's shape changes (e.g. a new row is inserted below the last row) or cells are
 * reordered (e.g. dragging a row/column to a new position), ProseMirror may reuse the existing
 * neighbouring cells as-is, so those cells never get a chance to update their edge attrs on
 * their own. This controller covers those cases from the table node view.
 *
 * Callers are responsible for feature-gating each call site.
 */
export class RoundedTableEdges {
	private readonly getTableElement: () => HTMLElement | undefined;
	private refreshHandle: number | undefined;
	// References to the previous render's border cells (O(rows + cols), perimeter-sized, not all cells).
	private prevSignature: PmNode[] | undefined;

	constructor(getTableElement: () => HTMLElement | undefined, node: PmNode) {
		this.getTableElement = getTableElement;

		// Baseline the edge signature so the first content edit doesn't trigger a spurious
		// refresh — the cells set their own edge attrs on construction.
		this.prevSignature = getPerimeterTableEdgeSignature(node);
	}

	/**
	 * Call from the node view's `update()` after `super.update()`. When the border signature
	 * changes it schedules a refresh of the edge attrs on the next animation frame.
	 */
	handleUpdate(node: PmNode): void {
		const nextSignature = getPerimeterTableEdgeSignature(node);
		const edgesChanged = tableEdgeSignaturesDiffer(this.prevSignature, nextSignature);
		this.prevSignature = nextSignature;

		if (edgesChanged) {
			this.scheduleRefresh(node);
		}
	}

	/** Call from the node view's `destroy()` to cancel any pending refresh. */
	destroy(): void {
		if (this.refreshHandle !== undefined) {
			cancelAnimationFrame(this.refreshHandle);
			this.refreshHandle = undefined;
		}
	}

	// The refresh runs on the next animation frame because ReactNodeView.update() schedules the
	// table's React render via the portal provider. If we read `table.rows` synchronously, we'd
	// still see the previous DOM.
	private scheduleRefresh(node: PmNode): void {
		if (this.refreshHandle !== undefined) {
			cancelAnimationFrame(this.refreshHandle);
		}

		this.refreshHandle = requestAnimationFrame(() => {
			this.refreshHandle = undefined;

			const table = this.getTableElement();
			if (table instanceof HTMLTableElement) {
				refreshRoundedTableEdgeAttrs(table, node);
			}
		});
	}
}
