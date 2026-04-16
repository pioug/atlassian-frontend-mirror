import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { filterCommand as filter, isSelectionEndOfParagraph } from '@atlaskit/editor-common/utils';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { Command } from '../types/command';

export const newlinePreserveMarksKey: PluginKey = new PluginKey('newlinePreserveMarksPlugin');

const isSelectionAligned = (state: EditorState): boolean =>
	!!state.selection.$to.parent.marks.find((m) => m.type === state.schema.marks.alignment);

const isSelectionFontSized = (state: EditorState): boolean => {
	const { blockTaskItem, listItem } = state.schema.nodes;
	const { fontSize } = state.schema.marks;
	const $to = state.selection.$to;
	const grandParent = $to.node($to.depth - 1);
	if (
		!fontSize ||
		// don't intercept Enter inside blockTaskItem or listItem
		(grandParent && (grandParent.type === blockTaskItem || grandParent.type === listItem))
	) {
		return false;
	}
	return !!$to.parent.marks.find((m) => m.type === fontSize);
};

const hasBlockMarksToPreserve = (state: EditorState): boolean =>
	isSelectionAligned(state) || isSelectionFontSized(state);

const splitBlockPreservingMarks: Command = (state, dispatch): boolean => {
	if (dispatch) {
		dispatch(state.tr.split(state.tr.mapping.map(state.selection.$from.pos), 1));
	}
	return true;
};

export default (): SafePlugin =>
	new SafePlugin({
		key: newlinePreserveMarksKey,
		props: {
			handleKeyDown: keydownHandler({
				Enter: expValEquals('platform_editor_small_font_size', 'isEnabled', true)
					? filter([isSelectionEndOfParagraph, hasBlockMarksToPreserve], splitBlockPreservingMarks)
					: filter([isSelectionEndOfParagraph, isSelectionAligned], splitBlockPreservingMarks),
			}),
		},
	});
