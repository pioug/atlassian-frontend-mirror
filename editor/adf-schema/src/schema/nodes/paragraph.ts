import { NodeSpec, DOMOutputSpec } from 'prosemirror-model';
import { AlignmentMarkDefinition, IndentationMarkDefinition } from '../marks';
import { MarksObject, NoMark } from './types/mark';
import { Inline } from './types/inline-content';

/**
 * @name paragraph_node
 */
export interface ParagraphBaseDefinition {
  type: 'paragraph';
  /**
   * @allowUnsupportedInline true
   */
  content?: Array<Inline>;
  marks?: Array<any>;
}

/**
 * @name paragraph_with_no_marks_node
 */
export type ParagraphDefinition = ParagraphBaseDefinition & NoMark;

/**
 * NOTE: Need this because TS is too smart and inline everything.
 * So we need to give them separate identity.
 * Probably there's a way to solve it but that will need time and exploration.
 * // http://bit.ly/2raXFX5
 * type T1 = X | Y
 * type T2 = A | T1 | B // T2 = A | X | Y | B
 */

/**
 * @name paragraph_with_alignment_node
 */
export type ParagraphWithAlignmentDefinition = ParagraphBaseDefinition &
  MarksObject<AlignmentMarkDefinition>;

/**
 * @name paragraph_with_indentation_node
 */
export type ParagraphWithIndentationDefinition = ParagraphBaseDefinition &
  MarksObject<IndentationMarkDefinition>;

export type ParagraphWithMarksDefinition =
  | ParagraphWithAlignmentDefinition
  | ParagraphWithIndentationDefinition;

const pDOM: DOMOutputSpec = ['p', 0];
export const paragraph: NodeSpec = {
  selectable: false,
  content: 'inline*',
  group: 'block',
  marks:
    'strong code em link strike subsup textColor typeAheadQuery underline confluenceInlineComment action annotation unsupportedMark unsupportedNodeAttribute dataConsumer',
  parseDOM: [{ tag: 'p' }],
  toDOM() {
    return pDOM;
  },
};
