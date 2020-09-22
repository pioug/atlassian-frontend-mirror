import { Node as PMNode } from 'prosemirror-model';

export function isListNode(node: PMNode | null | undefined) {
  return Boolean(
    node && node.type && ['orderedList', 'bulletList'].includes(node.type.name),
  );
}

export function isParagraphNode(node: PMNode | null | undefined) {
  return Boolean(node && node.type && 'paragraph' === node.type.name);
}

export function isListItemNode(node: PMNode | null | undefined) {
  return Boolean(node && node.type && 'listItem' === node.type.name);
}

export function isBulletList(node: PMNode | null | undefined) {
  return Boolean(node && node.type && 'bulletList' === node.type.name);
}
