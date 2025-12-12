import { bodiedSyncBlock as bodiedSyncBlockFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils';
import type { BreakoutMarkDefinition } from '../marks';
import type { ExpandDefinition as Expand } from './expand';
import type { PanelDefinition as Panel } from './panel';
import type {
	ParagraphDefinition as Paragraph,
	ParagraphWithMarksDefinition as ParagraphWithMarks,
} from './paragraph';
import type { BlockQuoteDefinition as Blockquote } from './blockquote';
import type {
	OrderedListDefinition as OrderedList,
	BulletListDefinition as BulletList,
} from './types/list';
import type { RuleDefinition as Rule } from './rule';
import type {
	HeadingDefinition as Heading,
	HeadingWithMarksDefinition as HeadingWithMarks,
} from './heading';
import type { CodeBlockDefinition as CodeBlock } from './code-block';
import type { MediaGroupDefinition as MediaGroup } from './media-group';
import type { MediaSingleDefinition as MediaSingle } from './media-single';
import type { DecisionListDefinition as DecisionList } from './decision-list';
import type { TaskListDefinition as TaskList } from './task-list';
import type { TableDefinition as Table } from './tableNodes';
import type { BlockCardDefinition as BlockCard } from './block-card';
import type { EmbedCardDefinition as EmbedCard } from './embed-card';
import type { LayoutSectionDefinition as LayoutSection } from './layout-section';

export interface BodiedSyncBlockAttrs {
	/**
	 * Required UUID attribute used for unique identification of the node
	 */
	localId: string;

	/**
	 * The ID of the resource to be synchronized.
	 */
	resourceId: string;
}

/**
 * Represents a block node that is designed to be synchronized
 * with an external resource across different products.
 * @name bodiedSyncBlock_node
 */
export interface BodiedSyncBlockDefinition {
	attrs: BodiedSyncBlockAttrs;
	/**
	 * @minItems 1
	 * @allowUnsupportedBlock true
	 */
	content: Array<
		| Paragraph
		| ParagraphWithMarks
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
		| Rule
		| Table
		| TaskList
	>;
	marks?: Array<BreakoutMarkDefinition>;
	type: 'bodiedSyncBlock';
}

export const bodiedSyncBlock = bodiedSyncBlockFactory({
	parseDOM: [
		{
			tag: 'div[data-bodied-sync-block]',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				const attrs: BodiedSyncBlockAttrs = {
					localId: dom.getAttribute('data-local-id') || uuid.generate(),
					resourceId: dom.getAttribute('data-resource-id') || '',
				};
				return attrs;
			},
		},
	],
	toDOM(node) {
		const { localId, resourceId } = node.attrs;
		const name = 'div';

		const attrs = {
			'data-bodied-sync-block': '',
			'data-local-id': localId,
			'data-resource-id': resourceId,
		};
		return [name, attrs, 0];
	},
});
