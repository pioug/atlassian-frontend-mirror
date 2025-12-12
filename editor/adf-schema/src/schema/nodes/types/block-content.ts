import type { ExpandDefinition as Expand } from '../expand';
import type { BodiedExtensionDefinition as BodiedExtension } from '../bodied-extension';
import type { PanelDefinition as Panel } from '../panel';
import type {
	ParagraphDefinition as Paragraph,
	ParagraphWithMarksDefinition as ParagraphWithMarks,
} from '../paragraph';
import type { BlockQuoteDefinition as Blockquote } from '../blockquote';
import type {
	OrderedListDefinition as OrderedList,
	BulletListDefinition as BulletList,
} from '../types/list';
import type { RuleDefinition as Rule } from '../rule';
import type {
	HeadingDefinition as Heading,
	HeadingWithMarksDefinition as HeadingWithMarks,
} from '../heading';
import type { CodeBlockDefinition as CodeBlock } from '../code-block';
import type { MediaGroupDefinition as MediaGroup } from '../media-group';
import type { MediaSingleDefinition as MediaSingle } from '../media-single';
import type { DecisionListDefinition as DecisionList } from '../decision-list';
import type { TaskListDefinition as TaskList } from '../task-list';
import type { TableDefinition as Table } from '../tableNodes';
import type { ExtensionDefinition as Extension } from '../extension';
import type { BlockCardDefinition as BlockCard } from '../block-card';
import type { EmbedCardDefinition as EmbedCard } from '../embed-card';

// NOTE: BlockContent is only being used by layoutColumn now.

/**
 * @name block_content
 */
export type BlockContent =
	| Panel
	| Paragraph
	| ParagraphWithMarks
	| Blockquote
	| OrderedList
	| BulletList
	| Rule
	| Heading
	| HeadingWithMarks
	| CodeBlock
	| MediaGroup
	| MediaSingle
	| DecisionList
	| TaskList
	| Table
	| Expand
	| Extension
	| BodiedExtension
	| BlockCard
	| EmbedCard;
