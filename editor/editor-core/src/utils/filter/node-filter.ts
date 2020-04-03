import { traverse, ADFEntity } from '@atlaskit/adf-utils';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';

export function removeMarks(node: ADFEntity) {
  let newNode = { ...node };
  delete newNode.marks;
  return newNode;
}

export function sanitizeNode(json: JSONDocNode): JSONDocNode {
  const sanitizedJSON = traverse(json as any, {
    text: node => {
      if (!node || !Array.isArray(node.marks)) {
        return node;
      }

      return {
        ...node,
        marks: node.marks.filter(mark => mark.type !== 'typeAheadQuery'),
      };
    },
    status: node => {
      if (node.attrs && !!node.attrs.text) {
        return removeMarks(node);
      }
      return false; // empty status
    },
    emoji: removeMarks,
    mention: removeMarks,
    date: removeMarks,
    hardBreak: removeMarks,
    inlineCard: removeMarks,
  }) as JSONDocNode;

  return sanitizedJSON;
}
