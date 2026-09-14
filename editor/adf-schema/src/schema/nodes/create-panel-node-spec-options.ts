import type {
	PanelNode,
	PanelC1Stage0Node as PanelC1Node,
} from '../../next-schema/generated/nodeTypes';
import type { NodeSpecOptions } from '../createPMSpecFactory';
import { getDomAttrs } from './get-dom-attrs';
import { getParseDOMAttrs } from './get-parse-dom-attrs';
import type { DOMAttributes } from './panel';

export const createPanelNodeSpecOptions: (
	allowCustomPanel: boolean,
	generateLocalId?: boolean,
) => NodeSpecOptions<PanelNode | PanelC1Node> = (allowCustomPanel, generateLocalId) => ({
	parseDOM: [
		{
			tag: 'div[data-panel-type]',
			getAttrs: (dom) => getParseDOMAttrs(allowCustomPanel, dom, generateLocalId),
		},
	],
	toDOM(node) {
		const attrs: DOMAttributes = getDomAttrs(node.attrs);

		const contentAttrs: Record<string, string> = {
			'data-panel-content': 'true',
		};

		return ['div', attrs, ['div', contentAttrs, 0]];
	},
});
