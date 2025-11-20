import { type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';
import { getText } from '../../utils';
import { type NodeReducer } from './';

const inlineCard: NodeReducer = (node: PMNode, _schema: Schema) => {
	return node.attrs.url || node.attrs.data?.url || getText(node);
};

export default inlineCard;
