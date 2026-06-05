import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

export const findExpand = (
	state: EditorState,
	selection?: Selection | null,
): ContentNodeWithPos | undefined => {
	const { expand, nestedExpand } = state.schema.nodes;
	return (
		findSelectedNodeOfType([expand, nestedExpand])(selection || state.selection) ||
		findParentNodeOfType([expand, nestedExpand])(selection || state.selection)
	);
};
