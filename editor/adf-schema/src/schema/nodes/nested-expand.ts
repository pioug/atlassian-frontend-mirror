import { Node as PMNode, NodeSpec } from 'prosemirror-model';
import { NoMark } from './types/mark';
import { ParagraphDefinition as Paragraph } from './paragraph';
import { HeadingDefinition as Heading } from './heading';
import { MediaSingleDefinition as MediaSingle } from './media-single';
import { MediaGroupDefinition as MediaGroup } from './media-group';

/**
 * @name nestedExpand_content
 * @minItems 1
 * @allowUnsupportedBlock true
 */
export type NestedExpandContent = Array<
  Paragraph | Heading | MediaSingle | MediaGroup
>;

/**
 * @name nestedExpand_node
 */
export interface NestedExpandBaseDefinition {
  type: 'nestedExpand';
  attrs: {
    title?: string;
  };
  content: NestedExpandContent;
}

/**
 * @name nestedExpand_with_no_marks_node
 */
export type NestedExpandDefinition = NestedExpandBaseDefinition & NoMark;

export const nestedExpand: NodeSpec = {
  inline: false,
  marks: 'link unsupportedMark unsupportedNodeAttribute',
  content:
    '(paragraph | heading | mediaSingle | mediaGroup | unsupportedBlock)+',
  isolating: true,
  selectable: true,
  attrs: {
    title: { default: '' },
    __expanded: { default: true },
  },
  parseDOM: [
    {
      context: 'nestedExpand//',
      tag: '[data-node-type="nestedExpand"]',
      skip: true,
    },
    {
      tag: '[data-node-type="nestedExpand"] button',
      ignore: true,
    },
    {
      tag: '[data-node-type="expand"] button',
      ignore: true,
    },
    {
      tag: 'div[data-node-type="nestedExpand"]',
      getAttrs: (domNode) => {
        const dom = domNode as HTMLElement;
        return {
          title: dom.getAttribute('data-title'),
          __expanded: true,
        };
      },
    },
  ],
  toDOM(node: PMNode) {
    const attrs = {
      'data-node-type': 'nestedExpand',
      'data-title': node.attrs.title,
      'data-expanded': node.attrs.__expanded,
    };
    return ['div', attrs, 0];
  },
};
