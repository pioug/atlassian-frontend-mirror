import { ADFEntity, VisitorCollection } from '../types';
import { traverse } from '../traverse/traverse';
import { scrubAttrs, scrubStr, scrubLink } from './scrub-content';

export default (adf: ADFEntity) =>
  traverse(adf, {
    any: node => {
      const updatedNode: { [key: string]: any } = {};

      if (node.type === 'emoji') {
        return {
          type: 'emoji',
          attrs: {
            id: '123',
            text: '😀',
            shortName: ':grinning:',
          },
        };
      }

      Object.entries(node).forEach(([key, value]) => {
        if (['version', 'type', 'content', 'marks'].includes(key)) {
          updatedNode[key] = value;
        }
      });

      if (node.text) {
        updatedNode.text = scrubStr(node.text);

        if (node.marks && Array.isArray(node.marks)) {
          updatedNode.marks = scrubLink(node.marks);
        }
      }

      if (node.attrs) {
        updatedNode.attrs = scrubAttrs(node.type, node.attrs);
      }

      return updatedNode as ADFEntity;
    },
  } as VisitorCollection);
