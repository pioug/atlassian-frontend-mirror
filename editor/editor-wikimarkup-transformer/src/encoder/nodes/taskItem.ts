import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { NodeEncoderOpts } from '..';
import { inlines } from './inlines';

export const taskItem = (
	node: PMNode,
	nestedLevel: number,
	{ context }: NodeEncoderOpts = {},
): string => {
	let result: string = '';
	node.forEach((n) => {
		// Generate stars based on depth
		const prefix = Array(nestedLevel).fill('*').join('');
		if (node.attrs.state === 'DONE') {
			result += `${prefix} -${inlines(n, { context })}-`;
		} else {
			result += `${prefix} ${inlines(n, { context })}`;
		}
	});
	return result;
};
