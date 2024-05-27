import { type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';
import { getText } from '../../utils';
import { type NodeReducer } from './';

const status: NodeReducer = (node: PMNode, schema: Schema) => {
  return node.attrs.text
    ? `[ ${node.attrs.text.toUpperCase()} ]`
    : getText(node);
};

export default status;
