import { NodeSpec, Node as PMNode } from 'prosemirror-model';
import { RichMediaAttributes } from './types/rich-media-common';

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

export interface DatasourceAttributeProperties extends RichMediaAttributes {
  id: string;
  parameters: object;
  views: [{ type: string; properties?: object }];
}

/**
 * @stage 0
 */
export interface DatasourceAttributes {
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
  attrs: CardAttributes | DatasourceAttributes;
}

export const blockCard: NodeSpec = {
  inline: false,
  group: 'block',
  draggable: true,
  selectable: true,
  attrs: {
    url: { default: null },
    data: { default: null },
    datasource: { default: null },
  },
  parseDOM: [
    {
      tag: 'a[data-block-card]',

      // bump priority higher than hyperlink
      priority: 100,

      getAttrs: (dom) => {
        const anchor = dom as HTMLAnchorElement;
        const data = anchor.getAttribute('data-card-data');
        const datasource = anchor.getAttribute('data-datasource');

        return {
          url: anchor.getAttribute('href') || null,
          data: data ? JSON.parse(data) : null,
          datasource: datasource ? JSON.parse(datasource) : null,
        };
      },
    },

    {
      tag: 'div[data-block-card]',

      getAttrs: (dom) => {
        const anchor = dom as HTMLDivElement;
        const data = anchor.getAttribute('data-card-data');
        const datasource = anchor.getAttribute('data-datasource');

        return {
          url: anchor.getAttribute('data-card-url') || null,
          data: data ? JSON.parse(data) : null,
          datasource: datasource ? JSON.parse(datasource) : null,
        };
      },
    },
  ],
  toDOM(node: PMNode) {
    const attrs = {
      'data-block-card': '',
      href: node.attrs.url || '',
      'data-card-data': node.attrs.data ? JSON.stringify(node.attrs.data) : '',
      'data-datasource': node.attrs.datasource
        ? JSON.stringify(node.attrs.datasource)
        : '',
    };
    return ['a', attrs, node?.attrs?.url || ' '];
  },
};
