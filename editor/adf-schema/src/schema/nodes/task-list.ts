import { Node, NodeSpec } from 'prosemirror-model';
import { TaskItemDefinition as TaskItemNode } from './task-item';
import { uuid } from '../../utils/uuid';

export interface TaskListContent
  extends Array<TaskItemNode | TaskListDefinition> {
  0: TaskItemNode;
}

/**
 * @name taskList_node
 */
export interface TaskListDefinition {
  type: 'taskList';
  /**
   * @minItems 1
   * @allowUnsupportedBlock true
   */
  content: TaskListContent;
  attrs: {
    localId: string;
  };
}

const name = 'actionList';

export const taskListSelector = `[data-node-type="${name}"]`;

export const taskList: NodeSpec = {
  group: 'block',
  defining: true,
  selectable: false,
  content: '(taskItem|unsupportedBlock)+ (taskItem|taskList|unsupportedBlock)*',
  marks: 'unsupportedMark unsupportedNodeAttribute',
  attrs: {
    localId: { default: '' },
  },
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
  toDOM(node: Node) {
    const { localId } = node.attrs;
    const attrs = {
      'data-node-type': name,
      'data-task-list-local-id': localId || 'local-task-list',
      style: 'list-style: none; padding-left: 0',
    };

    return ['div', attrs, 0];
  },
};
