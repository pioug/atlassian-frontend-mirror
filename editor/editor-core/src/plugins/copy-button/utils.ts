import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import {
  findSelectedNodeOfType,
  findParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import type {
  Schema,
  Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

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
