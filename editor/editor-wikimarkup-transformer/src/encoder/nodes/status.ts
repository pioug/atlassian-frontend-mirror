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
	// Teal — color.text.accent.teal.bolder
	'#B3F5FF': '#164555',
	// Green — reuses the legacy `green` value rather than emitting a second, near-identical green
	'#ABF5D1': '#36B37E',
	// Lime — a hue with no legacy name, so it takes its own color.text.accent.lime.bolder
	'#D3F1A7': '#37471F',
	// Yellow — takes its own color.text.accent.yellow.bolder. It cannot reuse the legacy `yellow`
	// value the way #ABF5D1 reuses `green`, because that value is `Y400` #FF991F, which is
	// orange-hued (33°) despite the name.
	'#FFF0B3': '#533F04',
	// Orange — reuses the legacy `yellow` value, which is the orange-hued one, rather than emitting
	// a second, near-identical orange
	'#FCE4A6': '#FF991F',
	// Magenta — color.text.accent.magenta.bolder
	'#FDD0EC': '#50253F',
};

const normalizeColor = (value: string): string =>
	value.startsWith('#') ? value.toUpperCase() : value;

export const status: NodeEncoder = (node: PMNode): string => {
	const text = `*[ ${node.attrs.text.toUpperCase()} ]*`;
	const newAttrs = { ...node.attrs };
	const key = normalizeColor(node.attrs.color ?? '');
	newAttrs.color = color[key] ?? color['grey'];
	return textColor(text, newAttrs);
};
