import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';
import {
	listItem as listItemFactory,
	listItemWithFlexibleFirstChildStage0 as listItemWithFlexibleFirstChildStage0Factory,
} from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils';

/**
 * @name list_item
 * @description this node allows task-list to be nested inside list-item
 */
export const listItem: NodeSpec = listItemFactory({
	parseDOM: [{ tag: 'li' }],
	toDOM() {
		return ['li', 0];
	},
});

/**
 * @name list_item_with_local_id
 * @description this node allows list items to have a localId attribute
 */
export const listItemWithLocalId: NodeSpec = listItemFactory({
	parseDOM: [{ tag: 'li', getAttrs: () => ({ localId: uuid.generate() }) }],
	toDOM(node: { attrs?: { localId?: string } }) {
		return ['li', { 'data-local-id': node?.attrs?.localId || undefined }, 0];
	},
});

/**
 * @name list_item_with_flexible_first_child_stage0
 * @description stage0 listItem with flexible first child (see EDITOR-5417)
 */
export const listItemWithFlexibleFirstChildStage0: NodeSpec =
	listItemWithFlexibleFirstChildStage0Factory({
		parseDOM: [{ tag: 'li', getAttrs: () => ({ localId: uuid.generate() }) }],
		toDOM(node: { attrs?: { localId?: string } }) {
			return ['li', { 'data-local-id': node?.attrs?.localId || undefined }, 0];
		},
	});
