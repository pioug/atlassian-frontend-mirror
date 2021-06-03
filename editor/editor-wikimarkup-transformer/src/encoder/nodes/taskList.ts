import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';

import { taskItem } from './taskItem';

const nestedNode = (node: PMNode, depth: number = 1): string => {
  const result: string[] = [];
  node.forEach((item) => {
    if (item.type.name === 'taskList') {
      result.push(nestedNode(item, depth + 1));
    } else {
      result.push(taskItem(item, depth));
    }
  });
  return result.join('\n');
};
export const taskList: NodeEncoder = (node: PMNode): string => {
  return nestedNode(node);
};
