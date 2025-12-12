import { uuid } from '../../utils';
import {
	listItem as listItemFactory,
	listItemWithNestedDecisionStage0 as listItemWithNestedDecisionStage0Factory,
} from '../../next-schema/generated/nodeTypes';

/**
 * @name list_item
 * @description this node allows task-list to be nested inside list-item
 */
export const listItem = listItemFactory({
	parseDOM: [{ tag: 'li' }],
	toDOM() {
		return ['li', 0];
	},
});

export const listItemWithLocalId = listItemFactory({
	parseDOM: [{ tag: 'li', getAttrs: () => ({ localId: uuid.generate() }) }],
	toDOM(node) {
		return ['li', { 'data-local-id': node?.attrs?.localId || undefined }, 0];
	},
});

/**
 * @name list_item_with_decision_stage0
 * @description this node allows decisions to be nested inside list-item
 */
export const listItemWithDecisionStage0 = listItemWithNestedDecisionStage0Factory({
	parseDOM: [{ tag: 'li' }],
	toDOM() {
		return ['li', 0];
	},
});

export const listItemWithNestedDecisionAndLocalIdStage0 = listItemWithNestedDecisionStage0Factory({
	parseDOM: [{ tag: 'li', getAttrs: () => ({ localId: uuid.generate() }) }],
	toDOM(node) {
		return ['li', { 'data-local-id': node?.attrs?.localId || undefined }, 0];
	},
});
