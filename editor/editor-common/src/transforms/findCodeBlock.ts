import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

export const findCodeBlock = (
	state: EditorState,
	selection?: Selection | null,
): ContentNodeWithPos | undefined => {
	const { codeBlock } = state.schema.nodes;
	return (
		findSelectedNodeOfType(codeBlock)(selection || state.selection) ||
		findParentNodeOfType(codeBlock)(selection || state.selection)
	);
};
