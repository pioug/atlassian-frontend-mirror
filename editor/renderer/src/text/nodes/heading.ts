import { Node as PMNode, Schema } from 'prosemirror-model';
import { NodeReducer, reduce } from './';

const heading: NodeReducer = (node: PMNode, schema: Schema) => {
  const result: string[] = [];

  node.forEach((n) => {
    result.push(reduce(n, schema));
  });

  return result.join('');
};

export default heading;
