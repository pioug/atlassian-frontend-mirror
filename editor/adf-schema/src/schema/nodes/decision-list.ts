import type { DecisionItemDefinition as DecisionItemNode } from './decision-item';
import { uuid } from '../../utils/uuid';
import { decisionList as decisionListFactory } from '../../next-schema/generated/nodeTypes';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

/**
 * @name decisionList_node
 */
export interface DecisionListDefinition {
	attrs: {
		localId: string;
	};
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 1
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedBlock true
	 */
	content: Array<DecisionItemNode>;
	type: 'decisionList';
}

const name = 'decisionList';

export const decisionListSelector: '[data-node-type="decisionList"]' = `[data-node-type="${name}"]`;

export const decisionList: NodeSpec = decisionListFactory({
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
