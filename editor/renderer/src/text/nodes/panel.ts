import { type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';
import { reduce, type NodeReducer } from './';

const panel: NodeReducer = (node: PMNode, schema: Schema) => {
  const result: string[] = [];

  node.forEach((n) => {
    result.push(reduce(n, schema));
  });

  return result.join('\n');
};

export default panel;
