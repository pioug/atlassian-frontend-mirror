import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type NodeEncoder } from '..';

import { mapping } from '../emoji-unicode-mapping';
import { unknown } from './unknown';

export const emoji: NodeEncoder = (node: PMNode): string => {
	const value = mapping[node.attrs.id];
	if (value) {
		return value;
	}
	if (node.attrs.shortName) {
		return node.attrs.shortName;
	}
	return unknown(node);
};
