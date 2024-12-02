import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { filterCommand as filter, isSelectionEndOfParagraph } from '@atlaskit/editor-common/utils';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { Command } from '../types/command';

export const newlinePreserveMarksKey = new PluginKey('newlinePreserveMarksPlugin');

const isSelectionAligned = (state: EditorState): boolean =>
	!!state.selection.$to.parent.marks.find((m) => m.type === state.schema.marks.alignment);

const splitBlockPreservingMarks: Command = (state, dispatch): boolean => {
	if (dispatch) {
		dispatch(state.tr.split(state.tr.mapping.map(state.selection.$from.pos), 1));
	}
	return true;
};

export default () =>
	new SafePlugin({
		key: newlinePreserveMarksKey,
		props: {
			handleKeyDown: keydownHandler({
				Enter: filter([isSelectionEndOfParagraph, isSelectionAligned], splitBlockPreservingMarks),
			}),
		},
	});
