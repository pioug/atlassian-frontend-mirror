import type { DateDefinition as Date } from '../date';
import type { EmojiDefinition as Emoji } from '../emoji';
import type { HardBreakDefinition as HardBreak } from '../hard-break';
import type { InlineCardDefinition as InlineCard } from '../inline-card';
import type { InlineExtensionDefinition } from '../inline-extension';
import type { MediaInlineDefinition } from '../media-inline';
import type { MentionDefinition as Mention } from '../mention';
import type { PlaceholderDefinition as Placeholder } from '../placeholder';
import type { StatusDefinition as Status } from '../status';
import type { TextDefinition as Text } from '../text';
import type { MarksObject } from './mark';
import type {
	AnnotationMarkDefinition as Annotation,
	CodeDefinition as Code,
	EmDefinition as Em,
	LinkDefinition as Link,
	StrikeDefinition as Strike,
	StrongDefinition as Strong,
	SubSupDefinition as SubSup,
	TextColorDefinition as TextColor,
	UnderlineDefinition as Underline,
	BackgroundColorDefinition as BackgroundColor,
} from '../../marks';

/**
 * @name formatted_text_inline_node
 */
export type InlineFormattedText = Text &
	MarksObject<
		Link | Em | Strong | Strike | SubSup | Underline | TextColor | Annotation | BackgroundColor
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
 * @name inline_node
 */
export type Inline =
	| InlineFormattedText
	| InlineCode
	| HardBreak
	| Mention
	| Emoji
	| InlineExtensionDefinition
	| Date
	| Placeholder
	| InlineCard
	| Status
	| MediaInlineDefinition;
