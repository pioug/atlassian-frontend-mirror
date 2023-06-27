import { NodeSpec, Node as PMNode } from 'prosemirror-model';
import { Layout, OptionalRichMediaAttributes } from './types/rich-media-common';

export interface UrlType {
  /**
   * @validatorFn safeUrl
   */
  url: string;
}

export interface DataType {
  /**
   * @additionalProperties true
   */
  data: object;
}

export interface DatasourceAttributeProperties {
  id: string;
  parameters: object;
  /**
   * @minItems 1
   */
  views: { type: string; properties?: object }[];
}

/**
 * @stage 0
 */
export interface DatasourceAttributes extends OptionalRichMediaAttributes {
  /**
   * @validatorFn safeUrl
   */
  url?: string;
  datasource: DatasourceAttributeProperties;
}

export type CardAttributes = UrlType | DataType;

/**
 * @name blockCard_node
 */
export interface BlockCardDefinition {
  type: 'blockCard';
  attrs: DatasourceAttributes | CardAttributes;
}

const getCommonAttributesFromDom = (
  dom: string | Node,
): Partial<BlockCardDefinition['attrs']> => {
  const anchor = dom as HTMLAnchorElement;
  const data = anchor.getAttribute('data-card-data');
  const datasource = anchor.getAttribute('data-datasource');

  return {
    data: data ? JSON.parse(data) : undefined,
    layout: datasource
      ? ((dom as HTMLElement).getAttribute('data-layout') as Layout) || 'center'
      : undefined,
    width: Number((dom as HTMLElement).getAttribute('data-width')) || undefined,
    datasource: datasource ? JSON.parse(datasource) : undefined,
  };
};

export const blockCard: NodeSpec = {
  inline: false,
  group: 'block',
  draggable: true,
  selectable: true,
  attrs: {
    url: { default: null },
    data: { default: null },
    datasource: { default: null },
    width: { default: null },
    layout: { default: null },
  },
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
  toDOM(node: PMNode) {
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
};
