import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { inlines } from './inlines';
import { type NodeEncoderOpts } from '..';

export const decisionItem = (node: PMNode, { context }: NodeEncoderOpts = {}): string => {
	let result: string = '';
	node.forEach((n) => {
		result += `* <> ${inlines(n, { context })}`;
	});
	return result;
};
