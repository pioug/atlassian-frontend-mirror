import { NodeSpec, Node as PMNode } from 'prosemirror-model';
import { CardAttributes } from './block-card';

export interface UrlType {
  url: string;
}

export interface DataType {
  /**
   * @additionalProperties true
   */
  data: object;
}

/**
 * @name inlineCard_node
 */
export interface InlineCardDefinition {
  type: 'inlineCard';
  attrs: CardAttributes;
}

export const inlineCard: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: true,
  draggable: true,
  attrs: {
    url: { default: null },
    data: { default: null },
  },
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
          url:
            anchor.getAttribute('href') ||
            anchor.getAttribute('data-card-url') ||
            null,
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
  toDOM(node: PMNode) {
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
};
