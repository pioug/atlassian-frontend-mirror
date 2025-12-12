import type { AnnotationMarkDefinition } from '../marks/annotation';
import { date as dateFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils';

/**
 * @name date_node
 */
export interface DateDefinition {
	attrs: {
		localId?: string;
		/**
		 * @minLength 1
		 */
		timestamp: string;
	};
	/**
	 * @stage 0
	 */
	marks?: Array<AnnotationMarkDefinition>;
	type: 'date';
}

export const date = dateFactory({
	parseDOM: [
		{
			tag: 'span[data-node-type="date"]',
			getAttrs: (dom) => ({
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				timestamp: (dom as HTMLElement).getAttribute('data-timestamp'),
			}),
		},
	],
	toDOM(node) {
		const attrs = {
			'data-node-type': 'date',
			'data-timestamp': node.attrs.timestamp,
		};
		return ['span', attrs];
	},
});

export const dateWithLocalId = dateFactory({
	parseDOM: [
		{
			tag: 'span[data-node-type="date"]',
			getAttrs: (dom) => ({
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				timestamp: (dom as HTMLElement).getAttribute('data-timestamp'),
				localId: uuid.generate(),
			}),
		},
	],
	toDOM(node) {
		const attrs = {
			'data-node-type': 'date',
			'data-timestamp': node.attrs.timestamp,
			'data-local-id': node?.attrs?.localId || undefined,
		};
		return ['span', attrs];
	},
});
