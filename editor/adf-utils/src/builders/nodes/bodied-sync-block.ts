import type { BlockCardDefinition as BlockCard } from '@atlaskit/adf-schema/block-card';
import type { BlockQuoteDefinition as Blockquote } from '@atlaskit/adf-schema/blockquote';
import type {
	BulletListDefinition as BulletList,
	OrderedListDefinition as OrderedList,
} from '@atlaskit/adf-schema/list';
import type { CodeBlockDefinition as CodeBlock } from '@atlaskit/adf-schema/code-block';
import type { DecisionListDefinition as DecisionList } from '@atlaskit/adf-schema/decision-list';
import type { EmbedCardDefinition as EmbedCard } from '@atlaskit/adf-schema/embed-card';
import type { ExpandDefinition as Expand } from '@atlaskit/adf-schema/expand';
import type {
	HeadingDefinition as Heading,
	HeadingWithMarksDefinition as HeadingWithMarks,
} from '@atlaskit/adf-schema/heading';
import type { LayoutSectionDefinition as LayoutSection } from '@atlaskit/adf-schema/layout-section';
import type { MediaGroupDefinition as MediaGroup } from '@atlaskit/adf-schema/media-group';
import type { MediaSingleDefinition as MediaSingle } from '@atlaskit/adf-schema/media-single';
import type { PanelDefinition as Panel } from '@atlaskit/adf-schema/panel';
import type {
	ParagraphDefinition as Paragraph,
	ParagraphWithMarksDefinition as ParagraphWithMarks,
} from '@atlaskit/adf-schema/paragraph';
import type { RuleDefinition as Rule } from '@atlaskit/adf-schema/rule';
import type { TableDefinition as Table } from '@atlaskit/adf-schema/tableNodes';
import type { TaskListDefinition as TaskList } from '@atlaskit/adf-schema/task-list';
import type { BodiedSyncBlockDefinition } from '@atlaskit/adf-schema/bodied-sync-block';

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
