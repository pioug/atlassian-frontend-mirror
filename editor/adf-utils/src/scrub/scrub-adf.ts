import { ADFEntity, VisitorCollection } from '../types';
import { traverse } from '../traverse/traverse';
import { scrubAttrs, scrubStr, scrubLink } from './scrub-content';

export type NodeReplacer = (node: ADFEntity) => ADFEntity;

export type NodeReplacements = {
  [key: string]: NodeReplacer;
};

const defaultReplacements: NodeReplacements = {
  emoji: () => ({
    type: 'emoji',
    attrs: {
      shortName: ':blue_star:',
      id: 'atlassian-blue_star',
      text: ':blue_star:',
    },
  }),
  date: () => ({
    type: 'date',
    attrs: {
      timestamp: new Date('2020-01-01').getTime(),
    },
  }),
  mention: () => ({
    type: 'mention',
    attrs: {
      id: 'error:NotFound',
      text: '@Nemo',
      accessLevel: 'CONTAINER',
    },
  }),
};

export default (adf: ADFEntity, userReplacements?: NodeReplacements) => {
  const replacements = { ...defaultReplacements, ...userReplacements };

  return traverse(adf, {
    any: node => {
      const replacement = replacements[node.type];

      if (typeof replacement === 'function') {
        return replacement(node);
      }

      const updatedNode: { [key: string]: any } = {};

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
};
