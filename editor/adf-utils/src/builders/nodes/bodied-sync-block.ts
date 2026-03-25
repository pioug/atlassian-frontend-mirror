import type { BlockCardDefinition as BlockCard, BlockQuoteDefinition as Blockquote, BulletListDefinition as BulletList, CodeBlockDefinition as CodeBlock, DecisionListDefinition as DecisionList, EmbedCardDefinition as EmbedCard, ExpandDefinition as Expand, HeadingDefinition as Heading, HeadingWithMarksDefinition as HeadingWithMarks, LayoutSectionDefinition as LayoutSection, MediaGroupDefinition as MediaGroup, MediaSingleDefinition as MediaSingle, OrderedListDefinition as OrderedList, PanelDefinition as Panel, ParagraphDefinition as Paragraph, ParagraphWithMarksDefinition as ParagraphWithMarks, RuleDefinition as Rule, TableDefinition as Table, TaskListDefinition as TaskList, BodiedSyncBlockDefinition } from '@atlaskit/adf-schema';

type BodiedSyncBlockContent =
	| BlockCard
	| Blockquote
	| BulletList
	| CodeBlock
	| DecisionList
	| EmbedCard
	| Expand
	| Heading
	| HeadingWithMarks
	| LayoutSection
	| MediaGroup
	| MediaSingle
	| OrderedList
	| Panel
	| Paragraph
	| ParagraphWithMarks
	| Rule
	| Table
	| TaskList;

export const bodiedSyncBlock =
	(attrs: BodiedSyncBlockDefinition['attrs']) =>
	(...content: Array<BodiedSyncBlockContent>): BodiedSyncBlockDefinition => ({
		type: 'bodiedSyncBlock',
		attrs,
		content,
	});
