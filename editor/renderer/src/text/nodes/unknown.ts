import { Node as PMNode, Schema } from 'prosemirror-model';
import { getText } from '../../utils';
import { reduce, NodeReducer } from './';

const unknown: NodeReducer = (node: PMNode, schema: Schema) => {
  const result: string[] = [];

  node.forEach((n) => {
    result.push(reduce(n, schema));
  });

  if (result.length > 0) {
    return result.join('');
  }
  return getText(node);
};

export default unknown;
