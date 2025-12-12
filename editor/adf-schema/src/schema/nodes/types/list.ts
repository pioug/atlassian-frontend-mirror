import type { ParagraphDefinition as Paragraph } from '../paragraph';
import type { MediaSingleDefinition as MediaSingle } from '../media-single';
import type { CodeBlockDefinition as CodeBlock } from '../code-block';
import type { TaskListDefinition as TaskList } from '../task-list';

export interface ListItemArray
	extends Array<
		Paragraph | OrderedListDefinition | BulletListDefinition | TaskList | MediaSingle | CodeBlock
	> {
	0: Paragraph | MediaSingle | CodeBlock;
}

/**
 * @name listItem_node
 */
export interface ListItemDefinition {
	attrs?: {
		localId?: string;
	};
	/**
	 * @minItems 1
	 * @allowUnsupportedBlock true
	 */
	content: ListItemArray;
	type: 'listItem';
}

/**
 * @name bulletList_node
 */
export interface BulletListDefinition {
	attrs?: {
		localId?: string;
	};
	/**
	 * @minItems 1
	 */
	content: Array<ListItemDefinition>;
	type: 'bulletList';
}

/**
 * @name orderedList_node
 */
export interface OrderedListDefinition {
	attrs?: {
		localId?: string;
		/**
		 * @minimum 0
		 */
		order?: number;
	};
	/**
	 * @minItems 1
	 */
	content: Array<ListItemDefinition>;
	type: 'orderedList';
}
