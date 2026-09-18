import type { BlockCardDefinition as BlockCard } from '../block-card';
import type { BlockQuoteDefinition as Blockquote } from '../blockquote';
import type { BodiedRuleDefinition as BodiedRule } from '../bodied-rule';
import type { CodeBlockDefinition as CodeBlock } from '../code-block';
import type { DecisionListDefinition as DecisionList } from '../decision-list';
import type { EmbedCardDefinition as EmbedCard } from '../embed-card';
import type { ExtensionDefinition as Extension } from '../extension';
import type { HeadingDefinition as Heading } from '../heading';
import type { MediaGroupDefinition as MediaGroup } from '../media-group';
import type { MediaSingleDefinition as MediaSingle } from '../media-single';
import type { PanelDefinition as Panel } from '../panel';
import type { ParagraphDefinition as Paragraph } from '../paragraph';
import type { RuleDefinition as Rule } from '../rule';
import type { TableDefinition as Table } from '../tableNodes';
import type { TaskListDefinition as TaskList } from '../task-list';
import type {
	OrderedListDefinition as OrderedList,
	BulletListDefinition as BulletList,
} from '../types/list';

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
	| BodiedRule
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
