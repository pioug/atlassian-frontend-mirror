import { uuid } from '@atlaskit/adf-schema';
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
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
export const toggleTaskList =
	(targetType: 'orderedList' | 'bulletList' | 'paragraph' = 'paragraph') =>
	({ tr }: { tr: Transaction }) => {
		const { nodes } = tr.doc.type.schema;
		const { selection } = tr;

		// Handle empty selection: insert a new task item
		const { $from } = selection;
		const isEmpty = $from.parent.content.size === 0;

		if (isEmpty && nodes.taskList && nodes.taskItem) {
			// Create an empty task list with one empty task item
			const listLocalId = uuid.generate();
			const itemLocalId = uuid.generate();
			const emptyList = nodes.taskList.create({ localId: listLocalId }, [
				nodes.taskItem.create({ localId: itemLocalId }),
			]);

			// Insert the empty list at the current selection
			const insertTr = safeInsert(emptyList)(tr);
			if (insertTr !== tr) {
				// Set cursor inside the new task item
				const insertPos = insertTr.selection.$from.pos;
				return insertTr.setSelection(TextSelection.near(insertTr.doc.resolve(insertPos)));
			}
		}

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
