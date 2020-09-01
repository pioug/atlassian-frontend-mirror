import { NodeSpec } from 'prosemirror-model';
import { ParagraphDefinition as Paragraph } from './paragraph';
// eslint-disable-next-line import/no-cycle
import { OrderedListDefinition as OrderedList } from './ordered-list';
// eslint-disable-next-line import/no-cycle
import { BulletListDefinition as BulletList } from './bullet-list';
import { MediaSingleDefinition as MediaSingle } from './media-single';
import { CodeBlockDefinition as CodeBlock } from './code-block';

export interface ListItemArray
  extends Array<
    Paragraph | OrderedList | BulletList | MediaSingle | CodeBlock
  > {
  0: Paragraph | MediaSingle | CodeBlock;
}

/**
 * @name listItem_node
 */
export interface ListItemDefinition {
  type: 'listItem';
  /**
   * @minItems 1
   */
  content: ListItemArray;
}

export const listItem: NodeSpec = {
  content:
    '(paragraph | mediaSingle | codeBlock) (paragraph | bulletList | orderedList | mediaSingle | codeBlock)*',
  marks: 'link unsupportedMark unsupportedNodeAttribute',
  defining: true,
  selectable: false,
  parseDOM: [{ tag: 'li' }],
  toDOM() {
    return ['li', 0];
  },
};
