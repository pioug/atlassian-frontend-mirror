import { traverse } from '@atlaskit/adf-utils/traverse';

import { JSONNode } from '../types';

import { removeMarks } from './remove-marks';

export function sanitizeNode(json: JSONNode): JSONNode {
  const sanitizedJSON = traverse(json, {
    text: (node) => {
      if (!node || !Array.isArray(node.marks)) {
        return node;
      }

      return {
        ...node,
        marks: node.marks.filter((mark) => mark.type !== 'typeAheadQuery'),
      };
    },
    status: (node) => {
      if (node.attrs && !!node.attrs.text) {
        return removeMarks(node);
      }
      return false; // empty status
    },
    caption: (node) => {
      if (node.content) {
        return node;
      }
      return false; // empty caption
    },
    emoji: removeMarks,
    mention: removeMarks,
    date: removeMarks,
    hardBreak: removeMarks,
    inlineCard: removeMarks,
  }) as JSONNode;

  return sanitizedJSON;
}
