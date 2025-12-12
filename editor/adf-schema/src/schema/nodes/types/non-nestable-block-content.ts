import type { PanelDefinition as Panel } from '../panel';
import type { ParagraphDefinition as Paragraph } from '../paragraph';
import type { BlockQuoteDefinition as Blockquote } from '../blockquote';
import type {
	OrderedListDefinition as OrderedList,
	BulletListDefinition as BulletList,
} from '../types/list';
import type { RuleDefinition as Rule } from '../rule';
import type { HeadingDefinition as Heading } from '../heading';
import type { CodeBlockDefinition as CodeBlock } from '../code-block';
import type { MediaGroupDefinition as MediaGroup } from '../media-group';
import type { MediaSingleDefinition as MediaSingle } from '../media-single';
import type { DecisionListDefinition as DecisionList } from '../decision-list';
import type { TaskListDefinition as TaskList } from '../task-list';
import type { TableDefinition as Table } from '../tableNodes';
import type { ExtensionDefinition as Extension } from '../extension';
import type { BlockCardDefinition as BlockCard } from '../block-card';
import type { EmbedCardDefinition as EmbedCard } from '../embed-card';

// We don't want paragraphs/headings with block marks inside bodied extensions or expands.
// We also don't want to allow nesting of expands or bodied extensions.
/**
 * @name non_nestable_block_content
 */
export type NonNestableBlockContent =
	| Panel
	| Paragraph
	| Blockquote
	| OrderedList
	| BulletList
	| Rule
	| Heading
	| CodeBlock
	| MediaGroup
	| MediaSingle
	| DecisionList
	| TaskList
	| Table
	| Extension
	| BlockCard
	| EmbedCard;
