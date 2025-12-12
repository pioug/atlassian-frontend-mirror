import type { DecisionItemDefinition as DecisionItemNode } from './decision-item';
import { uuid } from '../../utils/uuid';
import { decisionList as decisionListFactory } from '../../next-schema/generated/nodeTypes';

/**
 * @name decisionList_node
 */
export interface DecisionListDefinition {
	attrs: {
		localId: string;
	};
	/**
	 * @minItems 1
	 * @allowUnsupportedBlock true
	 */
	content: Array<DecisionItemNode>;
	type: 'decisionList';
}

const name = 'decisionList';

export const decisionListSelector = `[data-node-type="${name}"]`;

export const decisionList = decisionListFactory({
	parseDOM: [
		{
			tag: `ol${decisionListSelector}`,

			// Default priority is 50. We normally don't change this but since this node type is
			// also used by ordered-list we need to make sure that we run this parser first.
			priority: 100,

			getAttrs: () => ({
				localId: uuid.generate(),
			}),
		},
	],
	toDOM(node) {
		const { localId } = node.attrs;
		const attrs = {
			'data-node-type': name,
			'data-decision-list-local-id': localId || 'local-decision-list',
			style: 'list-style: none; padding-left: 0',
		};

		return ['ol', attrs, 0];
	},
});
