import type { ResolvedPos, Schema } from '@atlaskit/editor-prosemirror/model';
import { TextSelection, type Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

export const getNestedNodePosition = ({
	selection,
	schema,
	resolve,
}: {
	selection: Selection;
	schema: Schema;
	resolve: (pos: number) => ResolvedPos;
}) => {
	let nestedNodePos = selection.$from.before(1);
	if (selection instanceof TextSelection) {
		nestedNodePos = selection.$from.before();
		const $pos = resolve(nestedNodePos);
		if ($pos.depth < 1) {
			return nestedNodePos;
		}
		const parentNodeOfSpecificTypes = findParentNodeOfType([
			schema.nodes.bulletList,
			schema.nodes.orderedList,
			schema.nodes.blockquote,
			schema.nodes.taskList,
			schema.nodes.decisionList,
		])(selection);

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
