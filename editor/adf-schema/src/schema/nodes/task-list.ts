import type {
	TaskItemDefinition as TaskItemNode,
	BlockTaskItemDefinition as BlockTaskItem,
} from './task-item';
import { uuid } from '../../utils/uuid';
import { taskList as taskListFactory } from '../../next-schema/generated/nodeTypes';

export interface TaskListContent extends Array<TaskItemNode | TaskListDefinition | BlockTaskItem> {
	0: TaskItemNode | BlockTaskItem;
}

/**
 * @name taskList_node
 */
export interface TaskListDefinition {
	attrs: {
		localId: string;
	};
	/**
	 * @minItems 1
	 * @allowUnsupportedBlock true
	 */
	content: TaskListContent;
	type: 'taskList';
}

const name = 'actionList';

export const taskListSelector = `[data-node-type="${name}"]`;

export const taskList = taskListFactory({
	parseDOM: [
		{
			tag: `div${taskListSelector}`,

			// Default priority is 50. We normally don't change this but since this node type is
			// also used by ordered-list we need to make sure that we run this parser first.
			priority: 100,

			getAttrs: () => ({
				localId: uuid.generate(),
			}),
		},
	],
	toDOM(node) {
		const { localId } = node.attrs;
		const attrs = {
			'data-node-type': name,
			'data-task-list-local-id': localId || 'local-task-list',
			style: 'list-style: none; padding-left: 0',
		};

		return ['div', attrs, 0];
	},
});
