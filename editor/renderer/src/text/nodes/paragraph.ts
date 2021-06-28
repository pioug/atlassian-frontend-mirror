import { Node as PMNode, Schema } from 'prosemirror-model';
import { reduce, NodeReducer } from './';

const paragraph: NodeReducer = (node: PMNode, schema: Schema) => {
  const result: string[] = [];
  let previousNodeType = '';

  node.forEach((n) => {
    const text = reduce(n, schema);
    if (previousNodeType === 'mention' && !text.startsWith(' ')) {
      result.push(` ${text}`);
    } else {
      result.push(text);
    }
    previousNodeType = n.type.name;
  });

  return result.join('').trim();
};

export default paragraph;
