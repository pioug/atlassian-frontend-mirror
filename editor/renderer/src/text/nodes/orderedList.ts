import { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { getOrderFromOrderedListNode } from '@atlaskit/editor-common/utils';
import { reduce, NodeReducer } from './';

const orderedList: NodeReducer = (node: PMNode, schema: Schema) => {
  const result: string[] = [];
  const order = getOrderFromOrderedListNode(node);
  node.forEach((n, _offset, index) => {
    result.push(`${index + order}. ${reduce(n, schema)}`);
  });
  return result.join('\n');
};

export default orderedList;
