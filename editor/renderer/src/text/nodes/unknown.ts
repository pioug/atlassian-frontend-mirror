import { type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';
import { getText } from '../../utils';
import { reduce, type NodeReducer } from './';

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
