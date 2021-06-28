import { NodeSpec, Node as PMNode } from 'prosemirror-model';
import { RichMediaAttributes } from './types/rich-media-common';

export interface EmbedCardAttributes extends RichMediaAttributes {
  originalWidth?: number;
  originalHeight?: number;
  url: string;
}

/**
 * @name embedCard_node
 */
export interface EmbedCardDefinition {
  type: 'embedCard';
  attrs: EmbedCardAttributes;
}

export const embedCard: NodeSpec = {
  inline: false,
  group: 'block',
  selectable: true,
  attrs: {
    url: { default: '' },
    layout: { default: 'center' },
    width: { default: 100 },
    originalWidth: { default: null },
    originalHeight: { default: null },
  },
  parseDOM: [
    {
      tag: 'div[data-embed-card]',
      getAttrs: (dom) => ({
        url: (dom as HTMLElement).getAttribute('data-card-url'),
        layout: (dom as HTMLElement).getAttribute('data-layout') || 'center',
        width: Number((dom as HTMLElement).getAttribute('data-width')) || null,
        originalWidth:
          Number(
            (dom as HTMLElement).getAttribute('data-card-original-width'),
          ) || null,
        originalHeight:
          Number(
            (dom as HTMLElement).getAttribute('data-card-original-height'),
          ) || null,
      }),
    },
  ],
  toDOM(node: PMNode) {
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
};
