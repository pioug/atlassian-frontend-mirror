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
const listItemWithDecisionStage0Spec = listItemWithNestedDecisionStage0Factory({
	parseDOM: [{ tag: 'li' }],
	toDOM() {
		return ['li', 0];
	},
});

// Allow list-first content while preserving decisionList support in stage0.
const listItemStage0Content =
	'((paragraph | mediaSingle | codeBlock | unsupportedBlock | decisionList | extension) (paragraph | bulletList | orderedList | taskList | mediaSingle | codeBlock | unsupportedBlock | decisionList | extension)*) | ((paragraph | bulletList | orderedList | taskList | mediaSingle | codeBlock | unsupportedBlock | extension)+)';

export const listItemWithDecisionStage0 = {
	...listItemWithDecisionStage0Spec,
	content: listItemStage0Content,
};

export const listItemWithNestedDecisionAndLocalIdStage0 = listItemWithNestedDecisionStage0Factory({
	parseDOM: [{ tag: 'li', getAttrs: () => ({ localId: uuid.generate() }) }],
	toDOM(node) {
		return ['li', { 'data-local-id': node?.attrs?.localId || undefined }, 0];
	},
});
