import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';
import { unsupportedBlock as unsupportedBlockFactory } from '../../next-schema/generated/nodeTypes';

export const unsupportedBlock: NodeSpec = unsupportedBlockFactory({
	parseDOM: [
		{
			tag: '[data-node-type="unsupportedBlock"]',
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
			'data-node-type': 'unsupportedBlock',
			'data-original-value': JSON.stringify(node.attrs.originalValue),
		};
		return ['div', attrs, 'Unsupported content'];
	},
});
