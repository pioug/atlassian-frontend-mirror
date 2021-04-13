import { JSONNode } from '../index';

export function removeMarks(node: JSONNode) {
  let newNode = { ...node };
  delete newNode.marks;
  return newNode;
}
