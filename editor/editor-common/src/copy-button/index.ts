import type {
  NodeType,
  Node as PMNode,
  Schema,
} from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import {
  findParentNodeOfType,
  findSelectedNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';

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

// ED-19657:  adding a dummy comment, so that the cofluence pick's up the latest version.
