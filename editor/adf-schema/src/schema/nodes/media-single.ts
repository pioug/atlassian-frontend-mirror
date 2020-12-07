import { NodeSpec, Node } from 'prosemirror-model';
import { MediaDefinition as Media } from './media';
import { LinkDefinition } from '../marks/link';
import { RichMediaAttributes } from './types/rich-media-common';
import { CaptionDefinition as Caption } from './caption';

export type MediaSingleDefinition =
  | MediaSingleFullDefinition
  | MediaSingleWithCaptionDefinition;

/**
 * @name mediaSingle_base_node
 */
export interface MediaSingleBaseDefinition {
  type: 'mediaSingle';
  attrs?: RichMediaAttributes;
  marks?: Array<LinkDefinition>;
}
/**
 * @name mediaSingle_node
 */
export interface MediaSingleFullDefinition extends MediaSingleBaseDefinition {
  /**
   * @minItems 1
   * @maxItems 1
   */
  content: Array<Media>;
}
/**
 * @name mediaSingle_caption_node
 * @stage 0
 */
export interface MediaSingleWithCaptionDefinition
  extends MediaSingleBaseDefinition {
  /**
   * @minItems 1
   * @maxItems 2
   */
  content: [Media, Caption?];
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
  marks: 'unsupportedMark unsupportedNodeAttribute link',
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

export const mediaSingleWithCaption: NodeSpec = {
  ...mediaSingle,
  content: 'media caption?',
};

export const toJSON = (node: Node) => ({
  attrs: Object.keys(node.attrs).reduce<any>((obj, key) => {
    if (node.attrs[key] !== null) {
      obj[key] = node.attrs[key];
    }
    return obj;
  }, {}),
});
