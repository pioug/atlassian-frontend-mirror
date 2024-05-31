import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export const isFirstChildOfParent = (state: EditorState): boolean => {
	const { $from } = state.selection;
	return $from.depth > 1
		? (state.selection instanceof GapCursorSelection && $from.parentOffset === 0) ||
				$from.index($from.depth - 1) === 0
		: true;
};
