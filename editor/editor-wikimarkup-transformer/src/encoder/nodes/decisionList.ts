import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';
import { decisionItem } from './decisionItem';

export const decisionList: NodeEncoder = (node: PMNode): string => {
  const result: string[] = [];
  node.forEach((item) => {
    result.push(decisionItem(item));
  });
  return result.join('\n');
};
