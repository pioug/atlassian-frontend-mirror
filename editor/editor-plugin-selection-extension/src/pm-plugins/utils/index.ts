import isEqual from 'lodash/isEqual';

import { type ADFEntity } from '@atlaskit/adf-utils/types';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { TextSelection, type EditorState } from '@atlaskit/editor-prosemirror/state';
import { CellSelection, type Rect, TableMap } from '@atlaskit/editor-tables';

import { type SelectionRange } from '../../types';

const getSelectedRect = (selection: CellSelection): Rect => {
	const { $anchorCell, $headCell } = selection;
	const table = $anchorCell.node(-1);
	const map = TableMap.get(table);
	const start = $anchorCell.start(-1);
	const rect = map.rectBetween($anchorCell.pos - start, $headCell.pos - start);
	return rect;
};

type SelectionInfo = {
	selectedNodeAdf: ADFEntity;
	selectionRanges: SelectionRange[];
	selectedNode: PMNode;
	nodePos: number;
};

const getSelectionInfoFromSameNode = (selection: TextSelection) => {
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
		nodePos: $from.before(), // position before the selection
	};
};

const getSelectionInfoFromCellSelection = (selection: CellSelection) => {
	const selectedNode = selection.$anchorCell.node(-1);
	const nodePos = selection.$anchorCell.before(-1);
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

	return { selectedNode, selectionRanges, nodePos };
};

export const getSelectionInfo = (state: EditorState): SelectionInfo => {
	const selection = state.selection;

	let selectionInfo = {
		selectedNode: selection.$from.node(),
		selectionRanges: [] as SelectionRange[],
		nodePos: selection.$from.before(), // default to the position before the selection
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
	const { selectionRanges, selectedNode, nodePos } = selectionInfo;
	const selectedNodeAdf = serializer.encodeNode(selectedNode);

	return { selectedNodeAdf, selectionRanges, selectedNode, nodePos };
};

export const validateSelectedNode = (selectedNodeAdf: ADFEntity, selectedNode: PMNode): boolean => {
	const serializer = new JSONTransformer();
	const selectedNodeAdfFromState = serializer.encodeNode(selectedNode);

	return isEqual(selectedNodeAdf, selectedNodeAdfFromState);
};
