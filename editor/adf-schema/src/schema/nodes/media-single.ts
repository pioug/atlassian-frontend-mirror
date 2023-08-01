import { NodeSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { MediaDefinition as Media } from './media';
import { LinkDefinition } from '../marks/link';

import { ExtendedMediaAttributes, WidthType } from './types/rich-media-common';
import { CaptionDefinition as Caption } from './caption';
import { isDOMElement } from '../../utils/parseDOM';

export type MediaSingleDefinition =
  | MediaSingleFullDefinition
  | MediaSingleWithCaptionDefinition;

/**
 * @name mediaSingle_node
 * @additionalProperties true
 */
export interface MediaSingleBaseDefinition {
  type: 'mediaSingle';
  attrs?: ExtendedMediaAttributes;
  marks?: Array<LinkDefinition>;
}

/**
 * @additionalProperties true
 */
export interface MediaCaptionContent {
  /**
   * @minItems 1
   * @maxItems 2
   * @allowUnsupportedBlock true
   */
  content: [Media, Caption?];
}
/**
 * @name mediaSingle_caption_node
 */
export type MediaSingleWithCaptionDefinition = MediaSingleBaseDefinition &
  MediaCaptionContent;

/**
 * @additionalProperties true
 */
export interface MediaSingleFullContent {
  /**
   * @minItems 1
   * @maxItems 1
   * @allowUnsupportedBlock true
   */
  content: Array<Media>;
}

/**
 * @name mediaSingle_full_node
 */
export type MediaSingleFullDefinition = MediaSingleBaseDefinition &
  MediaSingleFullContent;

export const defaultAttrs = {
  width: { default: null }, // null makes small images to have original size by default
  layout: { default: 'center' },
};

export const mediaSingleSpec = ({
  withCaption = false,
  withExtendedWidthTypes = false,
}: {
  withCaption?: boolean;
  withExtendedWidthTypes?: boolean;
}): NodeSpec => {
  const content = withCaption
    ? 'media|unsupportedBlock+|media (caption|unsupportedBlock) unsupportedBlock*'
    : 'media|unsupportedBlock+|media unsupportedBlock+';

  const atom = !withCaption;

  const getAttrs = (dom: string | Node) => {
    if (!isDOMElement(dom)) {
      // this should never happen
      return { layout: 'center' };
    }

    const layout = dom.getAttribute('data-layout') || 'center';
    const width = Number(dom.getAttribute('data-width')) || null;
    const widthType = dom.getAttribute('data-width-type');

    if (withExtendedWidthTypes) {
      return { layout, width, widthType };
    } else if (widthType === WidthType.PIXEL) {
      // if editor does not support widthType attribute.
      // We ignore width and widthType together.
      return { layout };
    } else {
      return { layout, width };
    }
  };

  const getAttrsFromNode = (node: PMNode) => {
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

    if (withExtendedWidthTypes && node.attrs.widthType) {
      const { widthType } = node.attrs;
      return {
        ...attrs,
        'data-width-type': widthType || WidthType.PERCENTAGE,
      };
    }

    return attrs;
  };

  return {
    inline: false,
    group: 'block',
    selectable: true,
    atom,
    content,
    attrs: withExtendedWidthTypes
      ? { ...defaultAttrs, widthType: { default: null } }
      : defaultAttrs,
    marks: 'unsupportedMark unsupportedNodeAttribute border link',
    parseDOM: [
      {
        tag: 'div[data-node-type="mediaSingle"]',
        getAttrs,
      },
    ],
    toDOM(node: PMNode) {
      return ['div', getAttrsFromNode(node), 0];
    },
  };
};

export const mediaSingle: NodeSpec = mediaSingleSpec({
  withCaption: false,
  withExtendedWidthTypes: false,
});

export const mediaSingleWithCaption: NodeSpec = mediaSingleSpec({
  withCaption: true,
  withExtendedWidthTypes: false,
});

export const mediaSingleWithWidthType: NodeSpec = mediaSingleSpec({
  withCaption: false,
  withExtendedWidthTypes: true,
});

export const mediaSingleFull: NodeSpec = mediaSingleSpec({
  withCaption: true,
  withExtendedWidthTypes: true,
});

export const toJSON = (node: PMNode) => ({
  attrs: Object.keys(node.attrs).reduce<any>((obj, key) => {
    if (node.attrs[key] !== null) {
      obj[key] = node.attrs[key];
    }
    return obj;
  }, {}),
});
