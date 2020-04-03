import { Node as PMNode, Schema } from 'prosemirror-model';
import { reduce, NodeReducer } from './';

const orderedList: NodeReducer = (node: PMNode, schema: Schema) => {
  const result: string[] = [];
  node.forEach((n, _offset, index) => {
    result.push(`${index + 1}. ${reduce(n, schema)}`);
  });
  return result.join('\n');
};

export default orderedList;
