import { ADFEntity, VisitorCollection } from '../types';
import { traverse } from '../traverse/traverse';
import { scrubAttrs, scrubStr, scrubLink } from './scrub-content';
import {
  defaultNodeReplacements,
  NodeReplacements,
} from './default-node-replacements';
import {
  defaultValueReplacements,
  ValueReplacements,
} from './default-value-replacements';

export interface ScrubAdfOptions {
  nodeReplacements?: NodeReplacements;
  valueReplacements?: ValueReplacements;
}

export default (adf: ADFEntity, options: ScrubAdfOptions = {}) => {
  const nodeReplacements = {
    ...defaultNodeReplacements,
    ...options.nodeReplacements,
  };

  const valueReplacements = {
    ...defaultValueReplacements,
    ...options.valueReplacements,
  };

  return traverse(adf, {
    any: (node, parent) => {
      const replacement = nodeReplacements[node.type];

      if (typeof replacement === 'function') {
        const result = replacement(node, {
          parent,
          valueReplacements,
        });

        if (result !== false) {
          return result;
        }
      }

      const updatedNode: { [key: string]: any } = {};

      Object.entries(node).forEach(([key, value]) => {
        if (['version', 'type', 'content', 'marks'].includes(key)) {
          updatedNode[key] = value;
        }
      });

      if (node.text && node.marks) {
        updatedNode.marks = scrubLink(node.marks ?? [], {
          valueReplacements,
        });
      }

      if (node.text) {
        updatedNode.text = scrubStr(node.text);
      }

      if (node.attrs) {
        updatedNode.attrs = scrubAttrs(node.type, node.attrs);
      }

      return updatedNode as ADFEntity;
    },
  } as VisitorCollection);
};
