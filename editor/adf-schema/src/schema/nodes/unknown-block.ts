import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

const name = 'unknownBlock';

const unknownBlock = {
	group: 'block',
	content: 'inline+',
	marks: '_',
	toDOM() {
		return ['div', { 'data-node-type': name }, 0];
	},
	parseDOM: [{ tag: `div[data-node-type=\"${name}\"]` }],
} as NodeSpec;

export { unknownBlock as default, unknownBlock };
