import { ADFEntity } from '..';

export function removeMarks(node: ADFEntity) {
  let newNode = { ...node };
  delete newNode.marks;
  return newNode;
}
