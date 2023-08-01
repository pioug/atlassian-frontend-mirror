import { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { getText } from '../../utils';
import { NodeReducer } from './';

const status: NodeReducer = (node: PMNode, schema: Schema) => {
  return node.attrs.text
    ? `[ ${node.attrs.text.toUpperCase()} ]`
    : getText(node);
};

export default status;
