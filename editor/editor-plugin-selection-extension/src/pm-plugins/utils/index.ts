import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { TextSelection, type EditorState } from '@atlaskit/editor-prosemirror/state';
import { CellSelection, type Rect, TableMap } from '@atlaskit/editor-tables';

import { type SelectionExtensionFnOptions, type SelectionRange } from '../../types';

const getSelectedRect = (selection: CellSelection): Rect => {
	const { $anchorCell, $headCell } = selection;
	const table = $anchorCell.node(-1);
	const map = TableMap.get(table);
	const start = $anchorCell.start(-1);
	const rect = map.rectBetween($anchorCell.pos - start, $headCell.pos - start);
	return rect;
};

type SelectionInfo = {
	selectedNode: PMNode;
	selectionRanges: SelectionRange[];
};

const getSelectionInfoFromSameNode = (selection: TextSelection): SelectionInfo => {
	const { $from, $to } = selection;
	return {
		selectedNode: $from.node(),
		selectionRanges: [
			{
				start: {
					pointer: `/content/${$from.index()}/text`,
					position: $from.parentOffset,
				},
				end: {
					pointer: `/content/${$from.index()}/text`,
					position: $to.parentOffset - 1,
				},
			},
		],
	};
};

const getSelectionInfoFromCellSelection = (selection: CellSelection): SelectionInfo => {
	const selectedNode = selection.$anchorCell.node(-1);
	const selectionRanges: SelectionRange[] = [];
	const rect = getSelectedRect(selection);

	for (let row = rect.top; row < rect.bottom; row++) {
		selectionRanges.push({
			start: {
				pointer: `/content/${row}/content/${rect.left}`,
			},
			end: {
				pointer: `/content/${row}/content/${rect.right - 1}`,
			},
		});
	}

	return { selectedNode, selectionRanges };
};

export const getSelectionInfo = (state: EditorState): SelectionExtensionFnOptions => {
	const selection = state.selection;

	let selectionInfo: SelectionInfo = {
		selectedNode: selection.$from.node(),
		selectionRanges: [],
	};

	if (selection instanceof TextSelection) {
		const { $from, $to } = selection;
		if ($from.parent === $to.parent) {
			selectionInfo = getSelectionInfoFromSameNode(selection);
		} else {
			// TODO: ED-28405 - when selection spans multiple nodes including nested node, we need to iterate through the nodes
		}
	} else if (selection instanceof CellSelection) {
		selectionInfo = getSelectionInfoFromCellSelection(selection);
	}

	const serializer = new JSONTransformer();
	const selectedNodeAdf = serializer.encodeNode(selectionInfo.selectedNode);

	return { selectedNodeAdf, selectionRanges: selectionInfo.selectionRanges };
};
