import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export function getSelectionNodeTypes(state: EditorState): NodeType[] {
	const { from, to } = state.selection;

	const selectionNodeTypes = new Set<NodeType>();
	state.doc.nodesBetween(from, to, (node) => {
		selectionNodeTypes.add(node.type);
	});
	return Array.from(selectionNodeTypes);
}
