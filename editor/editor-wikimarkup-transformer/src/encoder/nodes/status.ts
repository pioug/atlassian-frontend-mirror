import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { NodeEncoder } from '..';
import { textColor } from '../marks/color';

const color: { [key: string]: string } = {
	grey: '#97A0AF',
	purple: '#6554C0',
	blue: '#00B8D9',
	red: '#FF5630',
	yellow: '#FF991F',
	green: '#36B37E',
};

export const status: NodeEncoder = (node: PMNode): string => {
	const text = `*[ ${node.attrs.text.toUpperCase()} ]*`;
	const newAttrs = { ...node.attrs };
	if (color[node.attrs.color]) {
		newAttrs.color = color[node.attrs.color];
	} else {
		newAttrs.color = color['grey'];
	}
	return textColor(text, newAttrs);
};
