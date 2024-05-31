import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type NodeEncoder, type NodeEncoderOpts } from '..';

import { listItem } from './listItem';

export const bulletList: NodeEncoder = (
	node: PMNode,
	{ context }: NodeEncoderOpts = {},
): string => {
	const result: string[] = [];
	node.forEach((item) => {
		result.push(listItem(item, '*', context));
	});
	return result.join('\n');
};
