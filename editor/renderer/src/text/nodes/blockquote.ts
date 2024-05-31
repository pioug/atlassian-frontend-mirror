import { type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';
import { type NodeReducer, reduce } from './';

const blockquote: NodeReducer = (node: PMNode, schema: Schema) => {
	const result: string[] = [];
	node.content.forEach((n) => {
		result.push(reduce(n, schema));
	});
	return `> ${result.join('')}`;
};

export default blockquote;
