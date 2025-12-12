import { unsupportedBlock as unsupportedBlockFactory } from '../../next-schema/generated/nodeTypes';

export const unsupportedBlock = unsupportedBlockFactory({
	parseDOM: [
		{
			tag: '[data-node-type="unsupportedBlock"]',
			getAttrs: (dom) => ({
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				originalValue: JSON.parse((dom as HTMLElement).getAttribute('data-original-value') || '{}'),
			}),
		},
	],
	toDOM(node) {
		const attrs = {
			'data-node-type': 'unsupportedBlock',
			'data-original-value': JSON.stringify(node.attrs.originalValue),
		};
		return ['div', attrs, 'Unsupported content'];
	},
});
