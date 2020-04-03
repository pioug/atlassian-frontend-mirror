import { Node as PMNode } from 'prosemirror-model';

// we don't show gap cursor for those nodes
const IGNORED_NODES = [
  'paragraph',
  'bulletList',
  'orderedList',
  'listItem',
  'taskItem',
  'decisionItem',
  'heading',
  'blockquote',
];

export const isIgnored = (node?: PMNode | null): boolean => {
  return !!node && IGNORED_NODES.indexOf(node.type.name) !== -1;
};
