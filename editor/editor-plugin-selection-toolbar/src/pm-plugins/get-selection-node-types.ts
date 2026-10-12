import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

export function getSelectionNodeTypes(state: EditorState): NodeType[] {
	const { from, to } = state.selection;

	if (isExperimentEnabled('platform_editor_reduce_memory_leaks')) {
		const selectionNodeTypes = new Set<NodeType>();
		state.doc.nodesBetween(from, to, (node) => {
			selectionNodeTypes.add(node.type);
		});
		return Array.from(selectionNodeTypes);
	}

	const selectionNodeTypes: NodeType[] = [];
	state.doc.nodesBetween(from, to, (node) => {
		if (selectionNodeTypes.indexOf(node.type) !== 0) {
			selectionNodeTypes.push(node.type);
		}
	});
	return selectionNodeTypes;
}
