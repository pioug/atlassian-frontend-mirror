import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';
import { syncBlock as syncBlockFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils';
import type { BreakoutMarkDefinition } from '../marks';

export interface SyncBlockAttrs {
	/**
	 * An optional UUID for unique identification of the node
	 */
	localId: string;

	/**
	 * The ID of the resource to be synchronized.
	 */
	resourceId: string;
}

/**
 * Represents a block node that is designed to be synchronized
 * with an external resource across different products.
 * @name syncBlock_node
 */
export interface SyncBlockDefinition {
	attrs: SyncBlockAttrs;
	marks?: Array<BreakoutMarkDefinition>;
	type: 'syncBlock';
}

export const syncBlock: NodeSpec = syncBlockFactory({
	parseDOM: [
		{
			tag: 'div[data-sync-block]',
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				const attrs: SyncBlockAttrs = {
					localId: dom.getAttribute('data-local-id') || uuid.generate(),
					resourceId: dom.getAttribute('data-resource-id') || '',
				};
				return attrs;
			},
		},
	],
	toDOM(node) {
		const { localId, resourceId } = node.attrs;
		const name = 'div';

		const attrs = {
			'data-sync-block': '',
			'data-local-id': localId,
			'data-resource-id': resourceId,
		};
		return [name, attrs];
	},
});
