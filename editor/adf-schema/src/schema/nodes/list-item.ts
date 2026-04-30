import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';
import { listItem as listItemFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils';

/**
 * @name list_item
 */
export const listItem: NodeSpec = listItemFactory({
	parseDOM: [{ tag: 'li' }],
	toDOM() {
		return ['li', 0];
	},
});

/**
 * @name list_item_with_local_id
 */
export const listItemWithLocalId: NodeSpec = listItemFactory({
	parseDOM: [{ tag: 'li', getAttrs: () => ({ localId: uuid.generate() }) }],
	toDOM(node: { attrs?: { localId?: string } }) {
		return ['li', { 'data-local-id': node?.attrs?.localId || undefined }, 0];
	},
});
