import { type EditorState, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

export const getNestedNodePosition = (state: EditorState) => {
	const { selection } = state;
	let nestedNodePos = selection.$from.before(1);
	if (selection instanceof TextSelection) {
		nestedNodePos = selection.$from.before();
		const $pos = state.doc.resolve(nestedNodePos);
		if ($pos.depth < 1) {
			return nestedNodePos;
		}
		const parentNodeOfSpecificTypes = findParentNodeOfType([
			state.schema.nodes.bulletList,
			state.schema.nodes.orderedList,
			state.schema.nodes.blockquote,
			state.schema.nodes.taskList,
			state.schema.nodes.decisionList,
		])(state.selection);

		if (parentNodeOfSpecificTypes) {
			const parentNodeType = parentNodeOfSpecificTypes.node.type.name;

			nestedNodePos = ['bulletList', 'orderedList'].includes(parentNodeType)
				? $pos.before($pos.depth - 1)
				: ['blockquote', 'taskList', 'decisionList'].includes(parentNodeType)
					? $pos.before()
					: nestedNodePos;
		}
	} else {
		nestedNodePos = selection.$from.pos;
	}

	return nestedNodePos;
};
