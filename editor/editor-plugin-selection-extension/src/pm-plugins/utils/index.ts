import isEqual from 'lodash/isEqual';

import { type ADFEntity } from '@atlaskit/adf-utils/types';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { TextSelection, type EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFullPageToolbarHeight } from '@atlaskit/editor-shared-styles';
import { CellSelection, type Rect, TableMap } from '@atlaskit/editor-tables';
import { fg } from '@atlaskit/platform-feature-flags';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { SelectionExtensionSelectionInfo } from '../../types';
import { type SelectionRange } from '../../types';
import { getBoundingBoxFromSelection } from '../../ui/getBoundingBoxFromSelection';

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

export const getSelectionTextInfo = (
	view: EditorView,
	api?: ExtractInjectionAPI<SelectionExtensionPlugin>,
): SelectionExtensionSelectionInfo => {
	const { selection: currentSelection } = view.state;
	const toolbarDocking = fg('platform_editor_use_preferences_plugin')
		? api?.userPreferences?.sharedState.currentState()?.preferences?.toolbarDockingPosition
		: api?.selectionToolbar?.sharedState?.currentState()?.toolbarDocking;
	const isEditMode = Boolean(api?.editorViewMode?.sharedState.currentState()?.mode === 'edit');
	const shouldOffsetToolbarHeight =
		toolbarDocking === 'top' && isEditMode && fg('platform_editor_selection_extension_api_v2');

	const { from, to } = currentSelection;
	const text = view.state.doc.textBetween(from, to, '\n');
	const coords = getBoundingBoxFromSelection(view, from, to, {
		top: shouldOffsetToolbarHeight ? akEditorFullPageToolbarHeight : 0,
		bottom: shouldOffsetToolbarHeight ? akEditorFullPageToolbarHeight : 0,
	});

	return { text, from, to, coords };
};

export const getSelectionAdfInfo = (state: EditorState): SelectionInfo => {
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
