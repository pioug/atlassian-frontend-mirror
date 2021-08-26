import { HardBreakDefinition as HardBreak } from '../hard-break';
import { MentionDefinition as Mention } from '../mention';
import { EmojiDefinition as Emoji } from '../emoji';
import {
  InlineExtensionDefinition as InlineExtensionWithoutMark,
  InlineExtensionWithMarksDefinition as InlineExtensionWithMark,
} from '../inline-extension';
import { DateDefinition as Date } from '../date';
import { PlaceholderDefinition as Placeholder } from '../placeholder';
import { InlineCardDefinition as InlineCard } from '../inline-card';
import { StatusDefinition as Status } from '../status';
import { TextDefinition as Text } from '../text';
import { MarksObject } from './mark';
import {
  AnnotationMarkDefinition as Annotation,
  CodeDefinition as Code,
  EmDefinition as Em,
  LinkDefinition as Link,
  StrikeDefinition as Strike,
  StrongDefinition as Strong,
  SubSupDefinition as SubSup,
  TextColorDefinition as TextColor,
  UnderlineDefinition as Underline,
} from '../../marks';
import { MediaInlineDefinition } from '../media-inline';

/**
 * @name formatted_text_inline_node
 */
export type InlineFormattedText = Text &
  MarksObject<
    Link | Em | Strong | Strike | SubSup | Underline | TextColor | Annotation
  >;
/**
 * @name link_text_inline_node
 */
export type InlineLinkText = Text & MarksObject<Link>;
/**
 * @name code_inline_node
 */
export type InlineCode = Text & MarksObject<Code | Link | Annotation>;

/**
 * @name atomic_inline_node
 */
export type InlineAtomic =
  | HardBreak
  | Mention
  | Emoji
  | InlineExtensionWithoutMark
  | Date
  | Placeholder
  | InlineCard
  | Status
  | MediaInlineDefinition;
/**
 * @name inline_node
 */
export type Inline =
  | InlineFormattedText
  | InlineCode
  | InlineExtensionWithMark
  | InlineAtomic;
