import type { JSONNode } from '../index';

export function removeMarks(node: JSONNode) {
  let newNode = { ...node };

  // Rolling this mark out to all nodes is expected to occur in FY24 Q4.
  // see https://team.atlassian.com/project/ATLAS-54592 for details.
  if (node.type === 'inlineCard' && node.marks) {
    newNode.marks = node.marks.filter((mark) => mark.type === 'annotation');
    return newNode;
  }

  delete newNode.marks;
  return newNode;
}
