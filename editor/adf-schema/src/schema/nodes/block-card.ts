import { NodeSpec, Node as PMNode } from 'prosemirror-model';

export interface UrlType {
  url: string;
}

export interface DataType {
  /**
   * @additionalProperties true
   */
  data: object;
}

export type CardAttributes = UrlType | DataType;

/**
 * @name blockCard_node
 */
export interface BlockCardDefinition {
  type: 'blockCard';
  attrs: CardAttributes;
}

export const blockCard: NodeSpec = {
  inline: false,
  group: 'block',
  draggable: true,
  selectable: true,
  attrs: {
    url: { default: null },
    data: { default: null },
  },
  parseDOM: [
    {
      tag: 'a[data-block-card]',

      // bump priority higher than hyperlink
      priority: 100,

      getAttrs: dom => {
        const anchor = dom as HTMLAnchorElement;
        const data = anchor.getAttribute('data-card-data');

        return {
          url: anchor.getAttribute('href') || null,
          data: data ? JSON.parse(data) : null,
        };
      },
    },

    {
      tag: 'div[data-block-card]',

      getAttrs: dom => {
        const anchor = dom as HTMLDivElement;
        const data = anchor.getAttribute('data-card-data');

        return {
          url: anchor.getAttribute('data-card-url') || null,
          data: data ? JSON.parse(data) : null,
        };
      },
    },
  ],
  toDOM(node: PMNode) {
    const attrs = {
      'data-block-card': '',
      href: node.attrs.url || '',
      'data-card-data': node.attrs.data ? JSON.stringify(node.attrs.data) : '',
    };
    return ['a', attrs];
  },
};
