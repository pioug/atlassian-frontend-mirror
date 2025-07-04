import type { IntlShape } from 'react-intl-next/src/types';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { isSelectionTableNestedInTable } from '@atlaskit/editor-common/nesting';
import type { Command } from '@atlaskit/editor-common/types';
import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import type { Direction } from '@atlaskit/editor-tables/types';
import {
	goToNextCell as baseGotoNextCell,
	findCellClosestToPos,
	findTable,
	findTableClosestToPos,
	isTableSelected,
} from '@atlaskit/editor-tables/utils';

import { getPluginState } from '../plugin-factory';

import { stopKeyboardColumnResizing } from './column-resize';
import { insertRowWithAnalytics } from './commands-with-analytics';

const TAB_FORWARD_DIRECTION = 1;
const TAB_BACKWARD_DIRECTION = -1;

export const goToNextCell =
	(
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
		ariaNotify?: (message: string) => void,
		getIntl?: () => IntlShape,
	) =>
	(direction: Direction): Command =>
	(state, dispatch, view) => {
		const table = findTable(state.selection);
		if (!table) {
			return false;
		}

		const isColumnResizing = getPluginState(state)?.isKeyboardResize;
		if (isColumnResizing) {
			stopKeyboardColumnResizing({
				ariaNotify: ariaNotify,
				getIntl: getIntl,
			})(state, dispatch, view);
			return true;
		}

		const map = TableMap.get(table.node);
		const { tableCell, tableHeader } = state.schema.nodes;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const cell = findParentNodeOfType([tableCell, tableHeader])(state.selection)!;
		const firstCellPos = map.positionAt(0, 0, table.node) + table.start;
		const lastCellPos = map.positionAt(map.height - 1, map.width - 1, table.node) + table.start;

		// When tabbing backwards at first cell (top left), insert row at the start of table
		if (firstCellPos === cell.pos && direction === TAB_BACKWARD_DIRECTION) {
			insertRowWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD, {
				index: 0,
				moveCursorToInsertedRow: true,
			})(state, dispatch);
			return true;
		}

		// When tabbing forwards at last cell (bottom right), insert row at the end of table
		if (lastCellPos === cell.pos && direction === TAB_FORWARD_DIRECTION) {
			insertRowWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD, {
				index: map.height,
				moveCursorToInsertedRow: true,
			})(state, dispatch);
			return true;
		}

		if (dispatch) {
			return baseGotoNextCell(direction)(state, dispatch);
		}

		return true;
	};

/**
 * Moves the cursor vertically from a NodeSelection within a table cell.
 * - If content exists above/below within the cell, lets ProseMirror handle it.
 * - Otherwise, moves to the next cell (down to start, up to last line).
 */
export const goToNextCellVertical =
	(direction: Direction): Command =>
	(state, dispatch) => {
		const { selection } = state;
		const nestedTableSelection = isSelectionTableNestedInTable(state);

		if (!(selection instanceof NodeSelection) && !nestedTableSelection) {
			return false; // Let ProseMirror handle other selection types
		}

		let table = findTable(selection);
		let cell = findCellClosestToPos(state.doc.resolve(selection.from));
		let selectionPos = selection.from;

		// Handle when we have nested table fully selected
		if (table && nestedTableSelection && isTableSelected(selection)) {
			const parentTablePos = table.pos;
			table = findTableClosestToPos(state.doc.resolve(parentTablePos));
			cell = findCellClosestToPos(state.doc.resolve(parentTablePos));
			selectionPos = parentTablePos;
		}

		if (!table || !cell || !cell.pos) {
			return false;
		}

		const { tableCell, tableHeader } = state.schema.nodes;

		// Let ProseMirror handle movement within the cell if content exists above/below
		if (cellHasContentInDirection(cell.node, cell.pos, selectionPos, direction)) {
			return false;
		}

		// Move to the next cell vertically
		const map = TableMap.get(table.node);
		const nextCellPos = map.nextCell(cell.pos - table.start, 'vert', direction);
		if (dispatch && nextCellPos) {
			const nextCellStart = table.start + nextCellPos;
			const $nextCell = state.doc.resolve(nextCellStart);

			if (
				$nextCell.nodeAfter?.type &&
				[tableCell, tableHeader].includes($nextCell.nodeAfter?.type)
			) {
				const contentPos = getTargetPositionInNextCell(
					$nextCell.nodeAfter,
					nextCellStart,
					direction,
				);

				dispatch(state.tr.setSelection(TextSelection.create(state.doc, contentPos)));
				return true;
			}

			return false;
		}

		return false; // No next cell found
	};

function cellHasContentInDirection(
	cellNode: PMNode,
	cellPos: number,
	selectionPos: number,
	direction: Direction,
): boolean {
	let hasContent = false;

	cellNode.content.forEach((node: PMNode, offset: number) => {
		const nodeStart = cellPos + 1 + offset;
		const nodeEnd = nodeStart + node.nodeSize;

		if (direction === 1 && nodeStart > selectionPos && node.isBlock) {
			hasContent = true; // Content below
		} else if (direction === -1 && nodeEnd <= selectionPos && node.isBlock) {
			hasContent = true; // Content above
		}
	});

	return hasContent;
}

function getTargetPositionInNextCell(
	cellNode: PMNode,
	nextCellStart: number,
	direction: Direction,
): number {
	let contentPos = nextCellStart + 1; // Default: just inside the cell
	if (cellNode.content.size > 0) {
		if (direction === 1) {
			const firstChild = cellNode.firstChild;
			if (firstChild && firstChild.isBlock) {
				contentPos = nextCellStart + 1 + (firstChild.isLeaf ? 0 : 1); // Down: Start of first block
			}
		} else if (direction === -1) {
			let lastBlock: PMNode | undefined;
			let lastOffset = 0;
			cellNode.content.forEach((node: PMNode, offset: number) => {
				if (node.isBlock) {
					lastBlock = node;
					lastOffset = offset;
				}
			});
			if (lastBlock) {
				contentPos =
					nextCellStart + 1 + lastOffset + (lastBlock.isLeaf ? 0 : lastBlock.nodeSize - 1);
			}
		}
	}
	return contentPos;
}
