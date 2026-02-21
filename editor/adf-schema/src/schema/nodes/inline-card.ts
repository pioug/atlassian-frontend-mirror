import type { CardAttributes } from './block-card';
import type { AnnotationMarkDefinition } from '../marks/annotation';
import { inlineCard as inlineCardFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

/**
 * @name inlineCard_node
 */
export interface InlineCardDefinition {
	attrs: CardAttributes;
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @stage 0
	 */
	marks?: Array<AnnotationMarkDefinition>;
	type: 'inlineCard';
}

export const inlineCard: NodeSpec = inlineCardFactory({
	parseDOM: [
		{
			tag: 'a[data-inline-card], span[data-inline-card]',

			// bump priority higher than hyperlink
			priority: 100,

			getAttrs: (dom) => {
				const anchor = dom as HTMLAnchorElement;
				const data = anchor.getAttribute('data-card-data');

				/* Support attrs from Editor and Renderer */
				return {
					url: anchor.getAttribute('href') || anchor.getAttribute('data-card-url') || null,
					data: data ? JSON.parse(data) : null,
				};
			},
		},

		// for renderer
		{
			tag: 'div[data-inline-card]',

			getAttrs: (dom) => {
				const anchor = dom as HTMLDivElement;
				const data = anchor.getAttribute('data-card-data');

				return {
					url: anchor.getAttribute('data-card-url'),
					data: data ? JSON.parse(data) : null,
				};
			},
		},
	],
	toDOM(node) {
		const attrs = {
			'data-inline-card': '',
			href: node.attrs.url || '',
			'data-card-data': node.attrs.data ? JSON.stringify(node.attrs.data) : '',
		};
		if (node.attrs.url) {
			return ['a', attrs, node.attrs.url];
		} else {
			return ['a', attrs];
		}
	},
});

export const inlineCardWithLocalId: NodeSpec = inlineCardFactory({
	parseDOM: [
		{
			tag: 'a[data-inline-card], span[data-inline-card]',

			// bump priority higher than hyperlink
			priority: 100,

			getAttrs: (dom) => {
				const anchor = dom as HTMLAnchorElement;
				const data = anchor.getAttribute('data-card-data');

				/* Support attrs from Editor and Renderer */
				return {
					url: anchor.getAttribute('href') || anchor.getAttribute('data-card-url') || null,
					data: data ? JSON.parse(data) : null,
					localId: uuid.generate(),
				};
			},
		},

		// for renderer
		{
			tag: 'div[data-inline-card]',

			getAttrs: (dom) => {
				const anchor = dom as HTMLDivElement;
				const data = anchor.getAttribute('data-card-data');

				return {
					url: anchor.getAttribute('data-card-url'),
					data: data ? JSON.parse(data) : null,
					localId: uuid.generate(),
				};
			},
		},
	],
	toDOM(node) {
		const attrs = {
			'data-inline-card': '',
			href: node.attrs.url || '',
			'data-card-data': node.attrs.data ? JSON.stringify(node.attrs.data) : '',
			'data-local-id': node?.attrs?.localId || undefined,
		};
		if (node.attrs.url) {
			return ['a', attrs, node.attrs.url];
		} else {
			return ['a', attrs];
		}
	},
});
