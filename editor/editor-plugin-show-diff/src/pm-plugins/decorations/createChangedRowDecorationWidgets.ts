import type { Change } from 'prosemirror-changeset';

import { areNodesEqualIgnoreAttrs } from '@atlaskit/editor-common/utils/document';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { findParentNodeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { DiffType } from '../../showDiffPluginType';
import { isExtendedEnabled } from '../isExtendedEnabled';
import type { NodeViewSerializer } from '../NodeViewSerializer';

import {
	buildAddedCellOverlayRoundedStyle,
	buildAddedCellOverlayStyle,
	buildDeletedCellOverlayRoundedStyle,
	buildDeletedCellOverlayStyle,
	buildDeletedRowStyle,
} from './colorSchemes/factory';
import { colorSchemeRegistry, getLegacyColorScheme } from './colorSchemes/schemes';
import type { ColorScheme } from './colorSchemes/types';
import { createLeftAnchorWidget } from './createAnchorDecorationWidgets';
import {
	resolveCellOverlayStyleLegacy,
	resolveDeletedRowStyleLegacy,
} from './createChangedRowDecorationWidgets.styles.legacy';
import { buildAnchorDecorationKey, buildDiffDecorationSpec } from './decorationKeys';
import { findSafeInsertPos } from './utils/findSafeInsertPos';
import {
	applyCellEdgeAttrs,
	getRowCellEdgeAttrs,
	getTableTopAndBottomCellEdgeAttrs,
	type CellEdgeAttrs,
} from './utils/tableCellEdgeAttrs';

interface RowInfo {
	cellEdgeAttrs?: Array<CellEdgeAttrs | undefined>;
	fromA: number;
	fromB: number;
	rowIndex: number;
	rowNode: PMNode;
	toA: number;
}

type SimpleChange = Pick<Change, 'fromA' | 'toA' | 'fromB' | 'deleted'>;

/**
 * Extracts information about deleted table rows from a change
 */
const extractChangedRows = ({
	change,
	originalDoc,
	newDoc,
	diffType,
}: {
	change: SimpleChange;
	diffType?: DiffType;
	newDoc: PMNode;
	originalDoc: PMNode;
}): RowInfo[] => {
	const changedRows: RowInfo[] = [];

	// Find the table in the original document
	const $fromPos = originalDoc.resolve(change.fromA);

	const tableOld = findParentNodeClosestToPos($fromPos, (node) => node.type.name === 'table');
	if (!tableOld) {
		return changedRows;
	}

	const oldTableMap = TableMap.get(tableOld.node);

	// Find the table in the new document at the insertion point
	const $newPos = newDoc.resolve(change.fromB);
	const tableNew = findParentNodeClosestToPos($newPos, (node) => node.type.name === 'table');

	if (!tableNew) {
		return changedRows;
	}

	const newTableMap = TableMap.get(tableNew.node);
	// A row DELETION makes the table shorter. An in-place whole-row REPLACEMENT (`replaceNode` on a
	// `tableRow`, which AI suggested edits emits) leaves the row count untouched — and this helper
	// was written for deletions only, so it used to discard every replacement and the changed row's
	// content was never rendered anywhere. The reviewer was left with just the removed side.
	const isRowDeletion = oldTableMap.height > newTableMap.height;
	const handleRowReplacement =
		oldTableMap.height === newTableMap.height && fg('platform_editor_ai_show_diff_patch_1');
	// If no rows were changed, return empty
	if (
		!(isRowDeletion || handleRowReplacement) ||
		// For now ignore if there are column deletions as well
		oldTableMap.width !== newTableMap.width
	) {
		return changedRows;
	}

	// Find which rows were changed by analyzing the change range
	const changeStartInTable = change.fromA - tableOld.pos - 1;
	const changeEndInTable = change.toA - tableOld.pos - 1;
	const edgeAttrsByOffset =
		isExtendedEnabled(diffType) &&
		expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true) &&
		isExperimentEnabled('platform_editor_table_diff_rounded_corners')
			? getTableTopAndBottomCellEdgeAttrs(oldTableMap)
			: undefined;

	let currentOffset = 0;
	let rowIndex = 0;

	tableOld.node.content.forEach((rowNode) => {
		const rowStart = currentOffset;
		const rowEnd = currentOffset + rowNode.nodeSize;

		// Check if this row overlaps with the deletion range
		const rowOverlapsChange =
			(rowStart >= changeStartInTable && rowStart < changeEndInTable) ||
			(rowEnd > changeStartInTable && rowEnd <= changeEndInTable) ||
			(rowStart < changeStartInTable && rowEnd > changeEndInTable);

		if (
			rowOverlapsChange &&
			rowNode.type.name === 'tableRow' &&
			(isExtendedEnabled(diffType) || !isEmptyRow(rowNode))
		) {
			const cellEdgeAttrs = edgeAttrsByOffset
				? getRowCellEdgeAttrs({ edgeAttrsByOffset, rowNode, rowStart })
				: undefined;

			const startOfRow = newTableMap.mapByRow
				.slice()
				.reverse()
				.find(
					(row) =>
						row[0] + tableNew.pos < change.fromB &&
						change.fromB < row[row.length - 1] + tableNew.pos,
				);
			changedRows.push({
				rowIndex,
				rowNode,
				cellEdgeAttrs,
				fromA: tableOld.pos + 1 + rowStart,
				toA: tableOld.pos + 1 + rowEnd,
				fromB: startOfRow ? startOfRow[0] + tableNew.start : change.fromB,
			});
		}

		currentOffset += rowNode.nodeSize;
		if (rowNode.type.name === 'tableRow') {
			rowIndex++;
		}
	});

	// Filter changes that never truly got deleted
	return changedRows.filter((changedRow) => {
		// A replacement leaves every sibling row in place, so asking "does this row still exist
		// ANYWHERE in the new table?" can drop a genuinely rewritten row that happens to match a
		// sibling. Compare it against the row at the same index instead. Deletions must keep the
		// whole-table `some()`: their indices shift, so an index comparison would let every
		// surviving row through and draw a widget for each one.
		if (handleRowReplacement) {
			const counterpart = tableNew.node.maybeChild(changedRow.rowIndex);
			return !counterpart || !areNodesEqualIgnoreAttrs(counterpart, changedRow.rowNode);
		}
		return !tableNew.node.children.some((newRow) =>
			areNodesEqualIgnoreAttrs(newRow, changedRow.rowNode),
		);
	});
};

/**
 * Checks if a table row is empty (contains no meaningful content)
 */
const isEmptyRow = (rowNode: PMNode): boolean => {
	let isEmpty = true;

	rowNode.descendants((node) => {
		if (!isEmpty) {
			return false;
		}

		// If we find any inline content with size > 0, the row is not empty
		if (node.isInline && node.nodeSize > 0) {
			isEmpty = false;
			return false;
		}

		// If we find text content, the row is not empty
		if (node.isText && node.text && node.text.trim() !== '') {
			isEmpty = false;
			return false;
		}

		return true;
	});

	return isEmpty;
};

/**
 * Creates a DOM representation of a deleted table row
 */
const createChangedRowDOM = (
	rowNode: PMNode,
	cellEdgeAttrs: Array<CellEdgeAttrs | undefined> | undefined,
	nodeViewSerializer: NodeViewSerializer,
	colorScheme?: ColorScheme,
	isInserted?: boolean,
	diffType?: DiffType,
): HTMLTableRowElement => {
	const tr = document.createElement('tr');
	const colors = colorSchemeRegistry[colorScheme ?? 'standard'];

	// Inserted rows keep their natural styling; the row strikethrough is deletions only.
	if (!isExtendedEnabled(diffType) || !isInserted) {
		tr.setAttribute(
			'style',
			isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
				? buildDeletedRowStyle(colors)
				: resolveDeletedRowStyleLegacy(getLegacyColorScheme(colorScheme)),
		);
	}
	// Mirrors the strikethrough condition above: under the extended experience an `isInserted` row
	// is ADDED content, so it must not claim the "deleted" testid — page models match that as
	// removed content (same reasoning as `createTableCellContentWidgets`).
	tr.setAttribute(
		'data-testid',
		isExtendedEnabled(diffType) && isInserted && fg('platform_editor_ai_show_diff_patch_1')
			? 'show-diff-changed-row'
			: 'show-diff-deleted-row',
	);

	// Serialize each cell in the row
	let cellIndex = 0;
	rowNode.content.forEach((cellNode) => {
		if (cellNode.type.name === 'tableCell' || cellNode.type.name === 'tableHeader') {
			const nodeView = nodeViewSerializer.tryCreateNodeView(cellNode);
			if (nodeView) {
				if (nodeView instanceof HTMLElement) {
					applyCellEdgeAttrs(nodeView, cellEdgeAttrs?.[cellIndex]);

					if (isExtendedEnabled(diffType)) {
						const overlay = document.createElement('span');
						const isRoundedTable = isExperimentEnabled(
							'platform_editor_table_diff_rounded_corners',
						);

						const overlayStyle = isExperimentEnabled(
							'platform_editor_show_diff_color_scheme_refactor',
						)
							? isInserted
								? isRoundedTable
									? buildAddedCellOverlayRoundedStyle(colors)
									: buildAddedCellOverlayStyle(colors)
								: isRoundedTable
									? buildDeletedCellOverlayRoundedStyle(colors)
									: buildDeletedCellOverlayStyle(colors)
							: resolveCellOverlayStyleLegacy({
									colorScheme: getLegacyColorScheme(colorScheme),
									isInserted,
									isRoundedTable,
								});

						overlay.setAttribute('style', overlayStyle);
						nodeView.appendChild(overlay);
					}
				}
				tr.appendChild(nodeView);
			} else {
				// Fallback to fragment serialization
				const serializedContent = nodeViewSerializer.serializeFragment(cellNode.content);
				if (serializedContent) {
					tr.appendChild(serializedContent);
				}
			}
			cellIndex++;
		}
	});

	return tr;
};

/**
 * Expands a diff to include whole changed rows when table rows are affected
 */
const expandDiffForChangedRows = ({
	changes,
	originalDoc,
	newDoc,
	diffType,
}: {
	changes: SimpleChange[];
	diffType?: DiffType;
	newDoc: PMNode;
	originalDoc: PMNode;
}): RowInfo[] => {
	const rowInfo: RowInfo[] = [];
	for (const change of changes) {
		// Check if this change affects table content
		const changedRows = extractChangedRows({
			change,
			originalDoc,
			newDoc,
			diffType,
		});

		if (changedRows.length > 0) {
			rowInfo.push(...changedRows);
		}
	}

	return rowInfo;
};

/**
 * Main function to handle deleted rows - computes diff and creates decorations
 */
export const createChangedRowDecorationWidgets = ({
	changes,
	originalDoc,
	newDoc,
	nodeViewSerializer,
	colorScheme,
	isInserted = false,
	diffType,
	showIndicators = false,
}: {
	changes: SimpleChange[];
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	isInserted?: boolean;
	newDoc: PMNode;
	nodeViewSerializer: NodeViewSerializer;
	originalDoc: PMNode;
	showIndicators?: boolean;
}): Decoration[] => {
	// First, expand the changes to include complete deleted rows
	const changedRows = expandDiffForChangedRows({
		changes: changes.filter((change) => change.deleted.length > 0),
		originalDoc,
		newDoc,
		diffType,
	});

	return changedRows.flatMap((changedRow) => {
		const rowDOM = createChangedRowDOM(
			changedRow.rowNode,
			changedRow.cellEdgeAttrs,
			nodeViewSerializer,
			colorScheme,
			isInserted,
			diffType,
		);

		// Find safe insertion position for the deleted row
		const safeInsertPos = findSafeInsertPos(
			newDoc,
			changedRow.fromB - 1, // -1 to find the first safe position from the table
			originalDoc.slice(changedRow.fromA, changedRow.toA),
		);

		const diffId = crypto.randomUUID();
		const decorations: Decoration[] = [];

		// `IndicatorBarContentComponent` renders a bar for every widget descriptor and anchors its
		// top and bottom to `anchor-<diffId>`. Without an element carrying that anchor name the bar
		// is still created but can never resolve a position, so it silently does not render and the
		// bar covers only the row being changed. `createNodeChangedDecorationWidget` sets the same
		// property on its own widget DOM for non-table content; this path returns before reaching it.
		if (
			showIndicators &&
			isExtendedEnabled(diffType) &&
			fg('platform_editor_ai_show_diff_patch_1')
		) {
			rowDOM.style.setProperty('anchor-name', `--${buildAnchorDecorationKey({ diffId })}`);

			// A table's content can extend past the doc margin, so the bar also needs a left anchor
			// measured against the table itself or it is clipped once the table is resized.
			const leftAnchor = createLeftAnchorWidget({ doc: newDoc, from: safeInsertPos, diffId });
			if (leftAnchor) {
				decorations.push(leftAnchor);
			}
		}

		decorations.push(
			Decoration.widget(safeInsertPos, rowDOM, {
				...buildDiffDecorationSpec({
					colorScheme,
					decorationType: 'widget',
					diffId,
					isActive: false,
					isInserted,
					diffType,
				}),
			}),
		);

		return decorations;
	});
};
