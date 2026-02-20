import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';
import { unsupportedInline as unsupportedInlineFactory } from '../../next-schema/generated/nodeTypes';

export const unsupportedInline: NodeSpec = unsupportedInlineFactory({
	parseDOM: [
		{
			tag: '[data-node-type="unsupportedInline"]',
			getAttrs: (dom) => ({
				originalValue: JSON.parse(
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					(dom as HTMLElement).getAttribute('data-original-value') || '{}',
				),
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
