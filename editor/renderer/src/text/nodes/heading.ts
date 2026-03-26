import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { reduce } from './';
import type { NodeReducer } from './';

const heading: NodeReducer = (node: PMNode, schema: Schema) => {
	const result: string[] = [];

	node.forEach((n) => {
		result.push(reduce(n, schema));
	});

	return result.join('');
};

export default heading;
