import { unsupportedInline as unsupportedInlineFactory } from '../../next-schema/generated/nodeTypes';

export const unsupportedInline = unsupportedInlineFactory({
	parseDOM: [
		{
			tag: '[data-node-type="unsupportedInline"]',
			getAttrs: (dom) => ({
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				originalValue: JSON.parse((dom as HTMLElement).getAttribute('data-original-value') || '{}'),
			}),
		},
	],
	toDOM(node) {
		const attrs = {
			'data-node-type': 'unsupportedInline',
			'data-original-value': JSON.stringify(node.attrs.originalValue),
		};
		return ['span', attrs, 'Unsupported content'];
	},
});
