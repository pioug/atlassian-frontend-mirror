import { NodeSpec, Node as PMNode } from 'prosemirror-model';
import { RichMediaAttributes } from './types/rich-media-common';
import { uuid } from '../../utils/uuid';

export interface EmbedCardAttributes extends RichMediaAttributes {
  originalWidth?: number;
  originalHeight?: number;
  /**
   * @validatorFn safeUrl
   */
  url: string;
  localId?: string;
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
    localId: { default: '' },
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
        localId: uuid.generate(),
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
