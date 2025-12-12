import { uuid } from '../../utils/uuid';
import type { Inline } from './types/inline-content';
import { decisionItem as decisionItemFactory } from '../../next-schema/generated/nodeTypes';

/**
 * @name decisionItem_node
 */
export interface DecisionItemDefinition {
	attrs: {
		localId: string;
		state: string;
	};
	/**
	 * @allowUnsupportedInline true
	 */
	content?: Array<Inline>;
	type: 'decisionItem';
}

export const decisionItem = decisionItemFactory({
	parseDOM: [
		{
			tag: 'li[data-decision-local-id]',

			// Default priority is 50. We normally don't change this but since this node type is
			// also used by list-item we need to make sure that we run this parser first.
			priority: 100,

			getAttrs: (dom) => ({
				localId: uuid.generate(),
				// eslint-disable-next-line @atlaskit/editor/no-as-casting, @typescript-eslint/no-non-null-assertion
				state: (dom as HTMLElement).getAttribute('data-decision-state')!,
			}),
		},
	],
	toDOM(node) {
		const { localId, state } = node.attrs;
		const attrs = {
			'data-decision-local-id': localId || 'local-decision',
			'data-decision-state': state,
		};
		return ['li', attrs, 0];
	},
});
