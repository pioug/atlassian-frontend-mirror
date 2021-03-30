import { Node as PMNode, Schema } from 'prosemirror-model';
import { getText } from '../../utils';
import { NodeReducer } from './';

const inlineCard: NodeReducer = (node: PMNode, schema: Schema) => {
  return node.attrs.url || node.attrs.data?.url || getText(node);
};

export default inlineCard;
