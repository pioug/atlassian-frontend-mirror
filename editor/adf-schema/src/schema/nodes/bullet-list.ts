import { uuid } from '../../utils';
import { bulletList as bulletListFactory } from '../../next-schema/generated/nodeTypes';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

export const bulletListSelector = '.ak-ul';

export const bulletList: NodeSpec = bulletListFactory({
	parseDOM: [{ tag: 'ul' }],
	toDOM() {
		const attrs = {
			class: bulletListSelector.substr(1),
		};
		return ['ul', attrs, 0];
	},
});

export const bulletListWithLocalId: NodeSpec = bulletListFactory({
	parseDOM: [
		{
			tag: 'ul',
			getAttrs: () => {
				return {
					localId: uuid.generate(),
				};
			},
		},
	],
	toDOM(node) {
		const attrs = {
			class: bulletListSelector.substr(1),
			'data-local-id': node?.attrs?.localId || undefined,
		};
		return ['ul', attrs, 0];
	},
});
