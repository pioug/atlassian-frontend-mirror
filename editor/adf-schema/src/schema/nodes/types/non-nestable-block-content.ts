import { PanelDefinition as Panel } from '../panel';
import { ParagraphDefinition as Paragraph } from '../paragraph';
import { BlockQuoteDefinition as Blockquote } from '../blockquote';
import { OrderedListDefinition as OrderedList } from '../ordered-list';
import { BulletListDefinition as BulletList } from '../bullet-list';
import { RuleDefinition as Rule } from '../rule';
import { HeadingDefinition as Heading } from '../heading';
import { CodeBlockDefinition as CodeBlock } from '../code-block';
import { MediaGroupDefinition as MediaGroup } from '../media-group';
import { MediaSingleDefinition as MediaSingle } from '../media-single';
import { DecisionListDefinition as DecisionList } from '../decision-list';
import { TaskListDefinition as TaskList } from '../task-list';
import { TableDefinition as Table } from '../tableNodes';
import {
  ExtensionDefinition as Extension,
  ExtensionWithMarksDefinition as ExtensionWithMarks,
} from '../extension';
import { BlockCardDefinition as BlockCard } from '../block-card';
import { EmbedCardDefinition as EmbedCard } from '../embed-card';

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
  | ExtensionWithMarks
  | BlockCard
  | EmbedCard;
