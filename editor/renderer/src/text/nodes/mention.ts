import { type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';
import { type NodeReducer } from './';

const mention: NodeReducer = (node: PMNode, schema: Schema) => {
	if (['all', 'here'].indexOf(node.attrs.id) !== -1) {
		return `@${node.attrs.id}`;
	}
	return `${node.attrs.text || '@unknown'}`;
};

export default mention;
