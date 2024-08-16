import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { hasParentNode } from '@atlaskit/editor-prosemirror/utils';

export const isNestedInExpand = (state: EditorState): boolean =>
	hasParentNode(
		(node) =>
			node.type === state.schema.nodes.expand || node.type === state.schema.nodes.nestedExpand,
	)(state.selection);
