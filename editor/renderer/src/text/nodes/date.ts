import { type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';
import { timestampToIsoFormat } from '@atlaskit/editor-common/utils';
import { getText } from '../../utils';
import { type NodeReducer } from './';

const date: NodeReducer = (node: PMNode, schema: Schema) => {
	return node.attrs.timestamp ? timestampToIsoFormat(node.attrs.timestamp) : getText(node);
};

export default date;
