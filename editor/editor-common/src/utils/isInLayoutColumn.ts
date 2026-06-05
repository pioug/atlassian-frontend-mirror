import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

export const isInLayoutColumn = (state: EditorState): boolean => {
	return hasParentNodeOfType(state.schema.nodes.layoutSection)(state.selection);
};
