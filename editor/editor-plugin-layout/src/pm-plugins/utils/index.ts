import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import { type EditorState, TextSelection } from '@atlaskit/editor-prosemirror/state';
import {
	type ContentNodeWithPos,
	findParentNodeOfType,
	findSelectedNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export const getMaybeLayoutSection = (state: EditorState): ContentNodeWithPos | undefined => {
	const {
		schema: {
			nodes: { layoutSection, layoutColumn },
		},
		selection,
	} = state;
	const isLayoutColumn =
		editorExperiment('advanced_layouts', true) && findSelectedNodeOfType([layoutColumn])(selection);

	// When selection is on layoutColumn, we want to hide floating toolbar, hence don't return layoutSection node here
	return isLayoutColumn
		? undefined
		: findParentNodeOfType(layoutSection)(selection) ||
				findSelectedNodeOfType([layoutSection])(selection);
};

/**
 * The depth of the layout column inside the layout section.
 * As per the current implementation, the layout column ALWAYS has a depth of 1.
 */
const LAYOUT_COLUMN_DEPTH = 1;

/**
 * This helper function is used to select a position inside a layout section.
 * @param view editor view instance
 * @param posOfLayout the starting position of the layout
 * @param childIndex the index of the child node in the layout section
 * @returns Transaction or undefined
 */
export const selectIntoLayout = (view: EditorView, posOfLayout: number, childIndex: number = 0) => {
	const $maybeLayoutSection = view.state.doc.resolve(posOfLayout);
	if ($maybeLayoutSection.nodeAfter?.type.name === 'layoutSection') {
		// $maybeLayoutSection.posAtIndex(1, 1);
		const layoutSectionNode = $maybeLayoutSection.nodeAfter;

		// check if the childIndex is valid
		if (childIndex < 0 || childIndex >= layoutSectionNode.childCount) {
			return;
		}

		const childPos = $maybeLayoutSection.posAtIndex(childIndex, LAYOUT_COLUMN_DEPTH);

		const tr = view.state.tr;
		const $selectionPos = tr.doc.resolve(childPos);

		if (layoutSectionNode.firstChild?.type.name === 'paragraph') {
			view.dispatch(tr.setSelection(TextSelection.near($selectionPos)));
		} else {
			view.dispatch(tr.setSelection(GapCursorSelection.near($selectionPos)));
		}
		return tr;
	}
};
