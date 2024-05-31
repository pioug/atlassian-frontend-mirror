import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

export const insideTable = (state: EditorState): Boolean => {
	const { table, tableCell } = state.schema.nodes;

	return hasParentNodeOfType([table, tableCell])(state.selection);
};
