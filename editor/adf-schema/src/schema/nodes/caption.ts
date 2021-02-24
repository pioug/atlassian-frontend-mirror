import { NodeSpec } from 'prosemirror-model';
import { InlineFormattedText, InlineCode } from './types/inline-content';
import { HardBreakDefinition as HardBreak } from './hard-break';
import { MentionDefinition as Mention } from './mention';
import { EmojiDefinition as Emoji } from './emoji';
import { DateDefinition as Date } from './date';
import { PlaceholderDefinition as Placeholder } from './placeholder';
import { InlineCardDefinition as InlineCard } from './inline-card';
import { StatusDefinition as Status } from './status';

/**
 * @stage 0
 * @name caption_node
 */
export interface CaptionDefinition {
  type: 'caption';
  /**
   * @minItems 0
   */
  content: Array<
    | InlineFormattedText
    | InlineCode
    | HardBreak
    | Mention
    | Emoji
    | Date
    | Placeholder
    | InlineCard
    | Status
  >;
}

export const caption: NodeSpec = {
  content: '(text|hardBreak|mention|emoji|date|placeholder|inlineCard|status)*',
  isolating: true,
  marks: '_',
  selectable: false,
  parseDOM: [
    {
      tag: 'figcaption[data-caption]',
    },
  ],
  toDOM(node) {
    const attrs: Record<string, string> = {
      'data-caption': 'true',
    };

    return ['figcaption', attrs, 0];
  },
};
