import { uuid } from '../../utils/uuid';
import type { Inline } from './types/inline-content';
import type { ParagraphDefinition as Paragraph } from './paragraph';
import type { ExtensionDefinition as Extension } from './extension';
import {
	taskItem as taskItemFactory,
	blockTaskItem as blockTaskItemFactory,
} from '../../next-schema/generated/nodeTypes';

/**
 * @name taskItem_node
 */
export interface TaskItemDefinition {
	attrs: {
		localId: string;
		state: 'TODO' | 'DONE';
	};
	/**
	 * @allowUnsupportedInline true
	 */
	content?: Array<Inline>;
	type: 'taskItem';
}

/**
 * @name blockTaskItem_node
 */
export interface BlockTaskItemDefinition {
	attrs: {
		localId: string;
		state: 'TODO' | 'DONE';
	};
	/**
	 * @allowUnsupportedInline true
	 */
	content?: Array<Paragraph | Extension>;
	type: 'blockTaskItem';
}

export const taskItem = taskItemFactory({
	parseDOM: [
		{
			tag: 'div[data-task-local-id]',

			// Default priority is 50. We normally don't change this but since this node type is
			// also used by list-item we need to make sure that we run this parser first.
			priority: 100,

			getAttrs: (dom) => ({
				localId: uuid.generate(),
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				state: (dom as HTMLElement).getAttribute('data-task-state') || 'TODO',
			}),
		},
	],
	toDOM(node) {
		const { localId, state } = node.attrs;
		const attrs = {
			'data-task-local-id': localId || 'local-task',
			'data-task-state': state || 'TODO',
		};
		return ['div', attrs, 0];
	},
});

export const blockTaskItem = blockTaskItemFactory({
	parseDOM: [
		{
			tag: 'div[data-task-is-block]',

			// Default priority is 50. We normally don't change this but since this node type is
			// also used by list-item we need to make sure that we run this parser first.
			priority: 100,

			getAttrs: (dom) => ({
				localId: uuid.generate(),
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				state: (dom as HTMLElement).getAttribute('data-task-state') || 'TODO',
			}),
		},
	],
	toDOM(node) {
		const { localId, state } = node.attrs;
		const attrs = {
			'data-task-local-id': localId || 'local-task',
			'data-task-state': state || 'TODO',
			'data-task-is-block': 'true',
		};
		return ['div', attrs, 0];
	},
});
