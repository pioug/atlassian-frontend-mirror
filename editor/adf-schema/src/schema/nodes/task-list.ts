import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';
import {
	taskList as taskListFactory,
	taskListWithFlexibleFirstChildStage0 as taskListWithFlexibleFirstChildStage0Factory,
} from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';
import type {
	BlockTaskItemDefinition as BlockTaskItem,
	TaskItemDefinition as TaskItemNode,
} from './task-item';

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
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 1
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedBlock true
	 */
	content: TaskListContent;
	type: 'taskList';
}

const name = 'actionList';

export const taskListSelector: '[data-node-type="actionList"]' = `[data-node-type="${name}"]`;

const taskListParseDOMAndToDOM = {
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
	toDOM(node: { attrs: { localId?: string } }) {
		const { localId } = node.attrs;
		const attrs = {
			'data-node-type': name,
			'data-task-list-local-id': localId || 'local-task-list',
			style: 'list-style: none; padding-left: 0',
		};

		return ['div', attrs, 0] as const;
	},
};

export const taskList: NodeSpec = taskListFactory(taskListParseDOMAndToDOM);

const taskListWithFlexibleFirstChild =
	taskListWithFlexibleFirstChildStage0Factory(taskListParseDOMAndToDOM);

/**
 * @name task_list_with_flexible_first_child_stage0
 * @description stage0 taskList with flexible first child content (see EDITOR-5417)
 */
export const taskListWithFlexibleFirstChildStage0: NodeSpec = {
	...taskListWithFlexibleFirstChild,
	// Generated spec omits PM group; keep taskList in block content for doc validation.
	group: 'block',
};
