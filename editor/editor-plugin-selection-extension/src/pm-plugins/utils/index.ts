import { type ADFEntity } from '@atlaskit/adf-utils/types';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Fragment, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	TextSelection,
	type EditorState,
	type Selection,
} from '@atlaskit/editor-prosemirror/state';
import { Transform } from '@atlaskit/editor-prosemirror/transform';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFullPageToolbarHeight } from '@atlaskit/editor-shared-styles';
import { CellSelection, TableMap, type Rect } from '@atlaskit/editor-tables';
import { fg } from '@atlaskit/platform-feature-flags';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { SelectionExtensionSelectionInfo } from '../../types';
import { type SelectionRange } from '../../types';
import { getBoundingBoxFromSelection } from '../../ui/getBoundingBoxFromSelection';

import { getSelectionInfo, getSelectionInfoFromSameNode } from './selection-helpers';

const getSelectedRect = (selection: CellSelection): Rect => {
	const { $anchorCell, $headCell } = selection;
	const table = $anchorCell.node(-1);
	const map = TableMap.get(table);
	const start = $anchorCell.start(-1);
	const rect = map.rectBetween($anchorCell.pos - start, $headCell.pos - start);
	return rect;
};

type SelectionInfo = {
	nodePos: number;
	selectedNode: PMNode;
	selectedNodeAdf: ADFEntity;
	selectionRanges?: SelectionRange[];
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

/**
 * @private
 * @deprecated use getFragmentInfoFromSelectionNew instead
 */
export const getSelectionTextInfo = (
	view: EditorView,
	api?: ExtractInjectionAPI<SelectionExtensionPlugin>,
): SelectionExtensionSelectionInfo => {
	const { selection: currentSelection } = view.state;
	const toolbarDocking =
		api?.userPreferences?.sharedState.currentState()?.preferences?.toolbarDockingPosition;
	const isEditMode = Boolean(api?.editorViewMode?.sharedState.currentState()?.mode === 'edit');
	const shouldOffsetToolbarHeight = toolbarDocking === 'top' && isEditMode;

	const { from, to } = currentSelection;
	const text = view.state.doc.textBetween(from, to, '\n');
	const coords = getBoundingBoxFromSelection(view, from, to, {
		top: shouldOffsetToolbarHeight ? akEditorFullPageToolbarHeight : 0,
		bottom: shouldOffsetToolbarHeight ? akEditorFullPageToolbarHeight : 0,
	});

	return { text, from, to, coords };
};

export const getSelectionTextInfoNew = (
	selection: Selection,
	view: EditorView,
	api?: ExtractInjectionAPI<SelectionExtensionPlugin>,
): SelectionExtensionSelectionInfo => {
	const toolbarDocking = fg('platform_editor_use_preferences_plugin')
		? api?.userPreferences?.sharedState.currentState()?.preferences?.toolbarDockingPosition
		: api?.selectionToolbar?.sharedState?.currentState()?.toolbarDocking;
	const isEditMode = Boolean(api?.editorViewMode?.sharedState.currentState()?.mode === 'edit');
	const shouldOffsetToolbarHeight = toolbarDocking === 'top' && isEditMode;

	const { from, to } = selection;
	const text = view.state.doc.textBetween(from, to, '\n');
	const coords = getBoundingBoxFromSelection(view, from, to, {
		top: shouldOffsetToolbarHeight ? akEditorFullPageToolbarHeight : 0,
		bottom: shouldOffsetToolbarHeight ? akEditorFullPageToolbarHeight : 0,
	});

	return { text, from, to, coords };
};

/**
 * @private
 * @deprecated use getFragmentInfoFromSelectionNew instead
 */
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

export const getFragmentInfoFromSelectionNew = (
	selection: Selection,
): { selectedNodeAdf: ADFEntity } => {
	const { schema } = selection.$from.doc.type;

	const slice = selection.content();
	let newDoc;
	try {
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

/**
 * @private
 * @deprecated use getSelectionAdfInfoNew instead
 */
export function getSelectionAdfInfo(state: EditorState): SelectionInfo {
	const selection = state.selection;
	let selectionInfo = {
		selectedNode: selection.$from.node(),
		nodePos: selection.$from.depth > 0 ? selection.$from.before() : selection.from,
	};

	if (selection instanceof TextSelection) {
		if (fg('platform_editor_selection_extension_improvement')) {
			// New implementation: unified handler for all text selections
			selectionInfo = getSelectionInfo(selection, state.schema);
		} else {
			const { $from, $to } = selection;
			if ($from.parent === $to.parent) {
				selectionInfo = getSelectionInfoFromSameNode(selection);
			}
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

export function getSelectionAdfInfoNew(selection: Selection): SelectionInfo {
	const schema = selection.$from.doc.type.schema;
	let selectionInfo = {
		selectedNode: selection.$from.node(),
		nodePos: selection.$from.depth > 0 ? selection.$from.before() : selection.from,
	};

	if (selection instanceof TextSelection) {
		if (fg('platform_editor_selection_extension_improvement')) {
			selectionInfo = getSelectionInfo(selection, schema);
		} else {
			const { $from, $to } = selection;
			if ($from.parent === $to.parent) {
				selectionInfo = getSelectionInfoFromSameNode(selection);
			}
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
