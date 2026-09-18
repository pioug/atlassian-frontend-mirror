import type { Change } from 'prosemirror-changeset';
import type { IntlShape } from 'react-intl';

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
import {
	createContributorTagWidget,
	isContributorTagWidgetEnabled,
	type ContributorTagMountContext,
} from './createContributorTagWidget';
import {
	AnchorTypeKey,
	buildAnchorDecorationKey,
	buildDiffDecorationSpec,
	scrollMarginTopValue,
} from './decorationKeys';
import { findSafeInsertPos } from './utils/findSafeInsertPos';
import {
	applyCellEdgeAttrs,
	getRowCellEdgeAttrs,
	getTableTopAndBottomCellEdgeAttrs,
	type CellEdgeAttrs,
} from './utils/tableCellEdgeAttrs';
import { createRemovedLozenge } from './utils/wrapBlockNodeView';

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

	// Filter changes that never truly got deleted. Compare the number of equivalent rows rather
	// than only checking whether one still exists: deleting two of three identical empty rows should
	// retain two changed rows even though the third remains in the new table.
	const equivalentRowDeletionCounts: Array<{ remaining: number; rowNode: PMNode }> = [];

	return changedRows.filter((changedRow) => {
		// A replacement leaves every sibling row in place, so asking "does this row still exist
		// ANYWHERE in the new table?" can drop a genuinely rewritten row that happens to match a
		// sibling. Compare it against the row at the same index instead.
		if (handleRowReplacement) {
			const counterpart = tableNew.node.maybeChild(changedRow.rowIndex);
			return !counterpart || !areNodesEqualIgnoreAttrs(counterpart, changedRow.rowNode);
		}

		let deletionCount = equivalentRowDeletionCounts.find(({ rowNode }) =>
			areNodesEqualIgnoreAttrs(rowNode, changedRow.rowNode),
		);

		if (!deletionCount) {
			const oldRowCount = tableOld.node.children.filter((oldRow) =>
				areNodesEqualIgnoreAttrs(oldRow, changedRow.rowNode),
			).length;
			const newRowCount = tableNew.node.children.filter((newRow) =>
				areNodesEqualIgnoreAttrs(newRow, changedRow.rowNode),
			).length;

			deletionCount = {
				remaining: Math.max(0, oldRowCount - newRowCount),
				rowNode: changedRow.rowNode,
			};
			equivalentRowDeletionCounts.push(deletionCount);
		}

		if (deletionCount.remaining === 0) {
			return false;
		}

		deletionCount.remaining--;
		return true;
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

type CreateChangedRowDOMProps = {
	cellEdgeAttrs: Array<CellEdgeAttrs | undefined> | undefined;
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	hasAnchoredRemovedLozenge?: boolean;
	intl?: IntlShape;
	isActive?: boolean;
	isInserted?: boolean;
	nodeViewSerializer: NodeViewSerializer;
	rowNode: PMNode;
};

/**
 * Creates a DOM representation of a deleted table row
 */
const createChangedRowDOM = ({
	rowNode,
	cellEdgeAttrs,
	nodeViewSerializer,
	colorScheme,
	isInserted,
	diffType,
	hasAnchoredRemovedLozenge,
	intl,
	isActive,
}: CreateChangedRowDOMProps): HTMLTableRowElement => {
	const tr = document.createElement('tr');
	const colors = colorSchemeRegistry[colorScheme ?? 'standard'];
	const deletedTreatment = isExperimentEnabled('platform_editor_show_diff_color_scheme_refactor')
		? buildDeletedRowStyle(colors)
		: resolveDeletedRowStyleLegacy(getLegacyColorScheme(colorScheme));
	const hostsRemovedLozenge =
		Boolean(intl) && isExtendedEnabled(diffType) && !isInserted && !hasAnchoredRemovedLozenge;

	// Inserted rows keep their natural styling; the row strikethrough is deletions only.
	if (!isExtendedEnabled(diffType) || !isInserted) {
		tr.setAttribute('style', deletedTreatment);
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
	if (fg('platform_editor_ai_show_diff_patch_1')) {
		tr.style.setProperty('scroll-margin-top', scrollMarginTopValue);
	}

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

	// A "Removed" label on the row's last cell, so it reads at the row's top right corner. Deletions
	// only: an inserted row is added content and carries no removal label.
	if (intl && hostsRemovedLozenge) {
		const lastCell = tr.lastElementChild;
		if (lastCell instanceof HTMLElement) {
			lastCell.style.position = 'relative';
			// Append, never prepend. Editor CSS resets the top margin of a cell's first child, so a
			// prepended label pushes the paragraph out of that reset and the row grows taller.
			lastCell.append(createRemovedLozenge(intl, isActive, colorScheme, true));
		}
	}

	return tr;
};

const supportsAnchorPositioning = (): boolean =>
	typeof CSS !== 'undefined' &&
	typeof CSS.supports === 'function' &&
	CSS.supports('top', 'anchor(--a top)');

const createAnchoredRemovedLozengeWidget = ({
	anchorName,
	colorScheme,
	from,
	intl,
	isActive,
}: {
	anchorName: string;
	colorScheme?: ColorScheme;
	from: number;
	intl: IntlShape;
	isActive?: boolean;
}): Decoration => {
	const lozenge = createRemovedLozenge(intl, isActive, colorScheme, true);
	const inset = lozenge.style.top;
	lozenge.style.setProperty('position', 'fixed');
	lozenge.style.setProperty('top', `calc(anchor(--${anchorName} top) + ${inset})`);
	lozenge.style.setProperty('left', `calc(anchor(--${anchorName} right) - ${inset})`);
	lozenge.style.setProperty('right', 'auto');
	lozenge.style.setProperty('transform', 'translateX(-100%)');

	return Decoration.widget(from, lozenge, {
		key: `removed-lozenge-${anchorName}`,
		side: -1,
	});
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
	attributionKey,
	changes,
	originalDoc,
	newDoc,
	nodeViewSerializer,
	colorScheme,
	isActive,
	isInserted = false,
	diffType,
	intl,
	showIndicators = false,
	showContributorTags = false,
	tagMountContext,
}: {
	attributionKey?: string;
	changes: SimpleChange[];
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	intl?: IntlShape;
	isActive?: boolean;
	isInserted?: boolean;
	newDoc: PMNode;
	nodeViewSerializer: NodeViewSerializer;
	originalDoc: PMNode;
	showContributorTags?: boolean;
	showIndicators?: boolean;
	tagMountContext?: ContributorTagMountContext;
}): Decoration[] => {
	// First, expand the changes to include complete deleted rows
	const changedRows = expandDiffForChangedRows({
		changes: changes.filter((change) => change.deleted.length > 0),
		originalDoc,
		newDoc,
		diffType,
	});

	return changedRows.flatMap((changedRow) => {
		// Keep the ID stable while contributor tags are enabled so recalculation preserves their state.
		const diffId = showContributorTags
			? `widget-row-${changedRow.fromA}-${changedRow.toA}`
			: crypto.randomUUID();
		const hasAnchoredRemovedLozenge =
			Boolean(intl) && isExtendedEnabled(diffType) && !isInserted && supportsAnchorPositioning();
		const rowDOM = createChangedRowDOM({
			rowNode: changedRow.rowNode,
			cellEdgeAttrs: changedRow.cellEdgeAttrs,
			nodeViewSerializer,
			colorScheme,
			isInserted,
			diffType,
			hasAnchoredRemovedLozenge,
			intl,
			isActive,
		});

		// Find safe insertion position for the deleted row
		const safeInsertPos = findSafeInsertPos(
			newDoc,
			changedRow.fromB - 1, // -1 to find the first safe position from the table
			originalDoc.slice(changedRow.fromA, changedRow.toA),
		);

		const decorations: Decoration[] = [];
		const rowAnchorNames: string[] = [];

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
			rowAnchorNames.push(buildAnchorDecorationKey({ diffId }));

			// A table's content can extend past the doc margin, so the bar also needs a left anchor
			// measured against the table itself or it is clipped once the table is resized.
			const leftAnchor = createLeftAnchorWidget({ doc: newDoc, from: safeInsertPos, diffId });
			if (leftAnchor) {
				decorations.push(leftAnchor);
			}
		}

		const tagAnchorName =
			showContributorTags && isContributorTagWidgetEnabled()
				? buildAnchorDecorationKey({ diffId, anchorType: AnchorTypeKey.tag })
				: undefined;
		const removedLozengeAnchorName = hasAnchoredRemovedLozenge
			? (tagAnchorName ?? buildAnchorDecorationKey({ diffId, anchorType: AnchorTypeKey.tag }))
			: undefined;
		const rowLabelAnchorName = tagAnchorName ?? removedLozengeAnchorName;
		const tagWidget = tagAnchorName
			? createContributorTagWidget({
					anchorAtRangeStart: true,
					anchorName: tagAnchorName,
					diffId,
					doc: newDoc,
					from: safeInsertPos,
					mountContext: tagMountContext,
					to: safeInsertPos,
				})
			: undefined;

		if (rowLabelAnchorName) {
			// Labels stay outside the table row so they do not inherit its deletion treatment.
			rowAnchorNames.push(rowLabelAnchorName);
		}
		if (rowAnchorNames.length > 0) {
			rowDOM.style.setProperty(
				'anchor-name',
				rowAnchorNames.map((anchorName) => `--${anchorName}`).join(', '),
			);
		}
		if (tagWidget) {
			// Lets the contributor tag reveal when any part of the deleted row is hovered.
			rowDOM.setAttribute('data-diff-id', diffId);
		}

		const rowWidget = Decoration.widget(safeInsertPos, rowDOM, {
			...buildDiffDecorationSpec({
				attributionKey: tagWidget ? attributionKey : undefined,
				colorScheme,
				decorationType: 'widget',
				diffId,
				isActive,
				isInserted,
				diffType,
			}),
		});

		decorations.push(rowWidget);
		if (intl && removedLozengeAnchorName) {
			decorations.push(
				createAnchoredRemovedLozengeWidget({
					anchorName: removedLozengeAnchorName,
					colorScheme,
					from: safeInsertPos,
					intl,
					isActive,
				}),
			);
		}
		if (tagWidget) {
			decorations.push(tagWidget);
		}

		return decorations;
	});
};
