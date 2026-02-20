import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';
import { image as imageFactory } from '../../next-schema/generated/nodeTypes';

export const image: NodeSpec = imageFactory({
	parseDOM: [
		{
			tag: 'img[src^="data:image/"]',
			ignore: true,
		},
		{
			tag: 'img[src]',
			getAttrs(domNode) {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				return {
					src: dom.getAttribute('src'),
					alt: dom.getAttribute('alt'),
					title: dom.getAttribute('title'),
				};
			},
		},
	],
	toDOM(node) {
		return ['img', node.attrs];
	},
});
