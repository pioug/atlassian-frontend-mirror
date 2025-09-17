import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';

export const findSyncBlock = (
	state: EditorState,
	selection?: Selection | null,
):
	| ReturnType<ReturnType<typeof findSelectedNodeOfType>>
	| ReturnType<ReturnType<typeof findParentNodeOfType>> => {
	const { syncBlock } = state.schema.nodes;
	return (
		findSelectedNodeOfType(syncBlock)(selection || state.selection) ||
		findParentNodeOfType(syncBlock)(selection || state.selection)
	);
};
