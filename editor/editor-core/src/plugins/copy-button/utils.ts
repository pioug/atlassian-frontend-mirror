import { NodeType } from 'prosemirror-model';
import {
  findSelectedNodeOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';
import { DOMSerializer, Schema, Node as PMNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';

export function getSelectedNodeOrNodeParentByNodeType({
  nodeType,
  selection,
}: {
  nodeType: NodeType | Array<NodeType>;
  selection: Transaction['selection'];
}) {
  let node = findSelectedNodeOfType(nodeType)(selection);
  if (!node) {
    node = findParentNodeOfType(nodeType)(selection);
  }
  return node;
}

export const toDOM = (node: PMNode, schema: Schema): Node => {
  return DOMSerializer.fromSchema(schema).serializeNode(node);
};
