import { Node as PMNode, Schema } from 'prosemirror-model';
import { timestampToIsoFormat } from '@atlaskit/editor-common';
import { getText } from '../../utils';
import { NodeReducer } from './';

const date: NodeReducer = (node: PMNode, schema: Schema) => {
  return node.attrs.timestamp
    ? timestampToIsoFormat(node.attrs.timestamp)
    : getText(node);
};

export default date;
