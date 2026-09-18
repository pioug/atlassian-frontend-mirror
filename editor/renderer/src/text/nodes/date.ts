import { timestampToIsoFormat } from '@atlaskit/editor-common/utils';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

import { getText } from '../../utils';
import type { NodeReducer } from './';

const date: NodeReducer = (node: PMNode, _schema: Schema) => {
	return node.attrs.timestamp ? timestampToIsoFormat(node.attrs.timestamp) : getText(node);
};

export default date;
