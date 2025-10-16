import {
	type BlockCardDefinition as BlockCard,
	type BlockQuoteDefinition as Blockquote,
	type BulletListDefinition as BulletList,
	type CodeBlockDefinition as CodeBlock,
	type DecisionListDefinition as DecisionList,
	type EmbedCardDefinition as EmbedCard,
	type ExpandDefinition as Expand,
	type HeadingDefinition as Heading,
	type HeadingWithMarksDefinition as HeadingWithMarks,
	type LayoutSectionDefinition as LayoutSection,
	type MediaGroupDefinition as MediaGroup,
	type MediaSingleDefinition as MediaSingle,
	type OrderedListDefinition as OrderedList,
	type PanelDefinition as Panel,
	type ParagraphDefinition as Paragraph,
	type ParagraphWithMarksDefinition as ParagraphWithMarks,
	type RuleDefinition as Rule,
	type TableDefinition as Table,
	type TaskListDefinition as TaskList,
	type BodiedSyncBlockDefinition,
} from '@atlaskit/adf-schema';

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
