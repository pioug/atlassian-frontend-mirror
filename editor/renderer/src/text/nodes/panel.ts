import { Node as PMNode, Schema } from 'prosemirror-model';
import { reduce, NodeReducer } from './';

const panel: NodeReducer = (node: PMNode, schema: Schema) => {
  const result: string[] = [];

  node.forEach((n) => {
    result.push(reduce(n, schema));
  });

  return result.join('\n');
};

export default panel;
