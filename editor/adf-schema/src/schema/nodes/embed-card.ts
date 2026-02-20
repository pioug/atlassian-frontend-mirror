import type { RichMediaAttributes } from './types/rich-media-common';
import { embedCard as embedCardFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

export interface EmbedCardAttributes extends RichMediaAttributes {
	localId?: string;
	originalHeight?: number;
	originalWidth?: number;
	url: string;
}

/**
 * @name embedCard_node
 */
export interface EmbedCardDefinition {
	attrs: EmbedCardAttributes;
	type: 'embedCard';
}

export const embedCard: NodeSpec = embedCardFactory({
	parseDOM: [
		{
			tag: 'div[data-embed-card]',
			getAttrs: (dom) => ({
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				url: (dom as HTMLElement).getAttribute('data-card-url'),
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				layout: (dom as HTMLElement).getAttribute('data-layout') || 'center',
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				width: Number((dom as HTMLElement).getAttribute('data-width')) || null,
				originalWidth:
					Number(
						// eslint-disable-next-line @atlaskit/editor/no-as-casting
						(dom as HTMLElement).getAttribute('data-card-original-width'),
					) || null,
				originalHeight:
					Number(
						// eslint-disable-next-line @atlaskit/editor/no-as-casting
						(dom as HTMLElement).getAttribute('data-card-original-height'),
					) || null,
			}),
		},
	],
	toDOM(node) {
		const { url, layout, width, originalWidth, originalHeight } = node.attrs;
		const attrs = {
			'data-embed-card': '',
			'data-card-url': url,
			'data-layout': layout,
			'data-width': width,
			'data-original-width': originalWidth,
			'data-original-height': originalHeight,
		};
		return ['div', attrs];
	},
});

export const embedCardWithLocalId: NodeSpec = embedCardFactory({
	parseDOM: [
		{
			tag: 'div[data-embed-card]',
			getAttrs: (dom) => ({
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				url: (dom as HTMLElement).getAttribute('data-card-url'),
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				layout: (dom as HTMLElement).getAttribute('data-layout') || 'center',
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				width: Number((dom as HTMLElement).getAttribute('data-width')) || null,
				originalWidth:
					Number(
						// eslint-disable-next-line @atlaskit/editor/no-as-casting
						(dom as HTMLElement).getAttribute('data-card-original-width'),
					) || null,
				originalHeight:
					Number(
						// eslint-disable-next-line @atlaskit/editor/no-as-casting
						(dom as HTMLElement).getAttribute('data-card-original-height'),
					) || null,
				localId: uuid.generate(),
			}),
		},
	],
	toDOM(node) {
		const { url, layout, width, originalWidth, originalHeight } = node.attrs;
		const attrs = {
			'data-embed-card': '',
			'data-card-url': url,
			'data-layout': layout,
			'data-width': width,
			'data-original-width': originalWidth,
			'data-original-height': originalHeight,
			'data-local-id': node?.attrs?.localId || undefined,
		};
		return ['div', attrs];
	},
});
