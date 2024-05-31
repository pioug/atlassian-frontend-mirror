import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type NodeEncoder, type NodeEncoderOpts } from '..';

import { inlines } from './inlines';

export const caption: NodeEncoder = (node: PMNode, { context }: NodeEncoderOpts = {}): string => {
	let result = '';
	node.forEach((n) => {
		result += inlines(n, { context });
	});

	return result;
};
