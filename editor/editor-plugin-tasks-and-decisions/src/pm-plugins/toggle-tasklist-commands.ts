import {
	transformBetweenListTypes,
	transformToTaskList,
	transformTaskListToBlockNodes,
	isBulletOrOrderedList,
	isTaskList,
	getFormattedNode,
} from '@atlaskit/editor-common/transforms';
import type { TransformContext } from '@atlaskit/editor-common/transforms';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export const toggleTaskList =
	(targetType: 'orderedList' | 'bulletList' | 'paragraph' = 'paragraph') =>
	({ tr }: { tr: Transaction }) => {
		const { nodes } = tr.doc.type.schema;
		const { selection } = tr;
		const { node, pos } = getFormattedNode(tr);

		if (node !== null && pos !== null) {
			if (isBulletOrOrderedList(node.type)) {
				const context: TransformContext = {
					sourceNode: node,
					sourcePos: pos,
					targetNodeType: nodes.taskList,
					tr,
				};

				return transformBetweenListTypes(context);
			}

			if (isTaskList(node.type)) {
				const context: TransformContext = {
					sourceNode: node,
					sourcePos: pos,
					targetNodeType: nodes[targetType],
					tr,
				};
				return targetType === 'paragraph'
					? transformTaskListToBlockNodes(context)
					: transformBetweenListTypes(context);
			}
			const { $from, $to } = selection;
			const range = $from.blockRange($to);
			if (range) {
				return transformToTaskList(tr, range, nodes.taskList, undefined, nodes);
			}
		}

		return tr;
	};
