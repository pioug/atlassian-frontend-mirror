import mapKeys from 'lodash/mapKeys';
import mapValues from 'lodash/mapValues';

import { type AttributeSpec, type Node, type NodeSpec } from '@atlaskit/editor-prosemirror/model';

import { RICH_INLINE_NODE } from '../constants';

export const createNodeSpec = (
	name: string,
	attrs: { [name: string]: AttributeSpec },
): NodeSpec => {
	return {
		group: RICH_INLINE_NODE,
		content: 'text*',
		inline: true,
		atom: true, // treat node as a leaf
		attrs,
		toDOM: (node: Node) => {
			const domAttrs = mapKeys(node.attrs, (_, attr) => `data-${attr}`);
			return [name, domAttrs, 0];
		},
		parseDOM: [
			{
				tag: name,
				getAttrs: (node) => {
					if (node instanceof Element) {
						return mapValues(attrs, (_, attr) => node.getAttribute(`data-${attr}`));
					}
					return null; // should never™ happen
				},
			},
		],
	};
};
