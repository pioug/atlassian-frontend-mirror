import { NodeSpec, Node } from 'prosemirror-model';
import { MediaDefinition as Media } from './media';
import { LinkDefinition } from '../marks/link';

export type Layout =
  | 'wrap-right'
  | 'center'
  | 'wrap-left'
  | 'wide'
  | 'full-width'
  | 'align-end'
  | 'align-start';

/**
 * @name mediaSingle_node
 */
export interface MediaSingleDefinition {
  type: 'mediaSingle';
  /**
   * @minItems 1
   * @maxItems 1
   */
  content: Array<Media>;
  attrs?: MediaSingleAttributes;
  marks?: Array<LinkDefinition>;
}
export interface MediaSingleAttributes {
  /**
   * @minimum 0
   * @maximum 100
   */
  width?: number;
  layout: Layout;
}

export const defaultAttrs = {
  width: { default: null },
  layout: { default: 'center' },
};

export const mediaSingle: NodeSpec = {
  inline: false,
  group: 'block',
  selectable: true,
  atom: true,
  content: 'media',
  attrs: defaultAttrs,
  parseDOM: [
    {
      tag: 'div[data-node-type="mediaSingle"]',
      getAttrs: dom => ({
        layout: (dom as HTMLElement).getAttribute('data-layout') || 'center',
        width: Number((dom as HTMLElement).getAttribute('data-width')) || null,
      }),
    },
  ],
  toDOM(node: Node) {
    const { layout, width } = node.attrs;
    const attrs = {
      'data-node-type': 'mediaSingle',
      'data-layout': layout,
      'data-width': '',
    };

    if (width) {
      attrs['data-width'] =
        isFinite(width) && Math.floor(width) === width
          ? width
          : width.toFixed(2);
    }

    return ['div', attrs, 0];
  },
};

export const toJSON = (node: Node) => ({
  attrs: Object.keys(node.attrs).reduce<any>((obj, key) => {
    if (node.attrs[key] !== null) {
      obj[key] = node.attrs[key];
    }
    return obj;
  }, {}),
});
