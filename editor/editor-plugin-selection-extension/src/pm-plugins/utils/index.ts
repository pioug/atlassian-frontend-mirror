import { type ADFEntity } from '@atlaskit/adf-utils/types';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Fragment, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { TextSelection, type EditorState } from '@atlaskit/editor-prosemirror/state';
import { Transform } from '@atlaskit/editor-prosemirror/transform';
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
	selectionRanges?: SelectionRange[];
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
					position: $to.parentOffset,
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

export const getFragmentInfoFromSelection = (
	state: EditorState,
): { selectedNodeAdf: ADFEntity } => {
	const { schema, selection } = state;

	const slice = selection.content();
	let newDoc;
	try {
		const { schema } = state;

		const doc = schema.node('doc', null, [schema.node('paragraph', null, [])]);
		const transform = new Transform(doc);

		newDoc = transform.replaceRange(0, 2, slice).doc;
	} catch (error) {
		newDoc = schema.nodes.doc.createChecked({}, Fragment.empty);
		logException(error as Error, { location: 'editor-plugin-selection-extension' });
	}

	const serializer = new JSONTransformer();
	const selectedNodeAdf = serializer.encodeNode(newDoc);

	return {
		selectedNodeAdf,
	};
};

export function getSelectionAdfInfo(state: EditorState): SelectionInfo {
	const selection = state.selection;
	let selectionInfo = {
		selectedNode: selection.$from.node(),
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
	const selectedNodeAdf = serializer.encodeNode(selectionInfo.selectedNode);

	return {
		...selectionInfo,
		selectedNodeAdf,
	};
}
