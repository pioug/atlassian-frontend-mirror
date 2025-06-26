import { darkModeSearchMatchClass, searchMatchExpandTitleClass, selectedSearchMatchClass } from '@atlaskit/editor-plugin-find-replace/styles';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

export const findParentExpandNode = (
	state: EditorState,
): ReturnType<ReturnType<typeof findParentNodeOfType>> => {
	return (
		findParentNodeOfType(state.schema.nodes.nestedExpand)(state.selection) ||
		findParentNodeOfType(state.schema.nodes.expand)(state.selection)
	);
};

export const findReplaceExpandDecorations = [
	darkModeSearchMatchClass,
	searchMatchExpandTitleClass,
	selectedSearchMatchClass,
]