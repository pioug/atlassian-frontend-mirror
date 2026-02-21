import type { Layout, OptionalRichMediaAttributes } from './types/rich-media-common';
import { blockCard as blockCardFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

export interface UrlType {
	localId?: string;
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @validatorFn safeUrl
	 */
	url: string;
}

export interface DataType {
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @additionalProperties true
	 */
	data: object;
	localId?: string;
}

export interface DatasourceAttributeProperties {
	id: string;
	parameters: object;
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 1
	 */
	views: { properties?: object; type: string }[];
}

export interface DatasourceAttributes extends OptionalRichMediaAttributes {
	datasource: DatasourceAttributeProperties;
	localId?: string;
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @validatorFn safeUrl
	 */
	url?: string;
}

export type CardAttributes = UrlType | DataType;

/**
 * @name blockCard_node
 */
export interface BlockCardDefinition {
	attrs: DatasourceAttributes | CardAttributes;
	type: 'blockCard';
}

const getCommonAttributesFromDom = (dom: string | Node): Partial<BlockCardDefinition['attrs']> => {
	const anchor = dom as HTMLAnchorElement;
	const data = anchor.getAttribute('data-card-data');
	const datasource = anchor.getAttribute('data-datasource');

	return {
		data: data ? JSON.parse(data) : undefined,
		layout: datasource
			? // eslint-disable-next-line @atlaskit/editor/no-as-casting
				((dom as HTMLElement).getAttribute('data-layout') as Layout) || undefined
			: undefined,
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		width: Number((dom as HTMLElement).getAttribute('data-width')) || undefined,
		datasource: datasource ? JSON.parse(datasource) : undefined,
	};
};

export const blockCard: NodeSpec = blockCardFactory({
	parseDOM: [
		{
			tag: 'a[data-block-card]',

			// bump priority higher than hyperlink
			priority: 100,

			getAttrs: (dom) => {
				const anchor = dom as HTMLAnchorElement;

				return {
					url: anchor.getAttribute('href') || undefined,
					...getCommonAttributesFromDom(dom),
				};
			},
		},

		{
			tag: 'div[data-block-card]',

			getAttrs: (dom) => {
				const anchor = dom as HTMLDivElement;

				return {
					url: anchor.getAttribute('data-card-url') || undefined,
					...getCommonAttributesFromDom(dom),
				};
			},
		},
	],
	toDOM(node) {
		const { url } = node.attrs as UrlType;
		const { data } = node.attrs as DataType;
		const { layout, width, datasource } = node.attrs as DatasourceAttributes;
		const attrs = {
			'data-block-card': '',
			href: url || '',
			'data-card-data': data ? JSON.stringify(data) : '',
			'data-datasource': datasource ? JSON.stringify(datasource) : '',
			'data-layout': layout,
			'data-width': `${width}`,
		};
		return ['a', attrs, node?.attrs?.url || ' '];
	},
});

export const blockCardWithLocalId: NodeSpec = blockCardFactory({
	parseDOM: [
		{
			tag: 'a[data-block-card]',

			// bump priority higher than hyperlink
			priority: 100,

			getAttrs: (dom) => {
				const anchor = dom as HTMLAnchorElement;

				return {
					url: anchor.getAttribute('href') || undefined,
					...getCommonAttributesFromDom(dom),
					localId: uuid.generate(),
				};
			},
		},

		{
			tag: 'div[data-block-card]',

			getAttrs: (dom) => {
				const anchor = dom as HTMLDivElement;

				return {
					url: anchor.getAttribute('data-card-url') || undefined,
					...getCommonAttributesFromDom(dom),
					localId: uuid.generate(),
				};
			},
		},
	],
	toDOM(node) {
		const { url } = node.attrs as UrlType;
		const { data } = node.attrs as DataType;
		const { layout, width, datasource } = node.attrs as DatasourceAttributes;
		const attrs = {
			'data-block-card': '',
			href: url || '',
			'data-card-data': data ? JSON.stringify(data) : '',
			'data-datasource': datasource ? JSON.stringify(datasource) : '',
			'data-layout': layout,
			'data-width': `${width}`,
			'data-local-id': node?.attrs?.localId || undefined,
		};
		return ['a', attrs, node?.attrs?.url || ' '];
	},
});
