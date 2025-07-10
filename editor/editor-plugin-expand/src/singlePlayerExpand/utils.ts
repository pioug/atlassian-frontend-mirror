import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

// from platform/packages/editor/editor-plugin-find-replace/src/ui/styles.ts
const darkModeSearchMatchClass = 'search-match-dark';
const searchMatchExpandTitleClass = 'search-match-expand-title';
const selectedSearchMatchClass = 'selected-search-match';

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
];
