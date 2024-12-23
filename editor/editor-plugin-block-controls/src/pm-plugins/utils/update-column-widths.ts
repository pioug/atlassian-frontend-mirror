import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type Transaction } from '@atlaskit/editor-prosemirror/state';

import { DEFAULT_COLUMN_DISTRIBUTIONS } from '../../ui/consts';

export const updateColumnWidths = (
	tr: Transaction,
	layoutNode: PMNode,
	layoutNodePos: number,
	childCount: number,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	const newColumnWidth = DEFAULT_COLUMN_DISTRIBUTIONS[childCount];

	if (newColumnWidth) {
		layoutNode.content.forEach((node, offset) => {
			if (node.type.name === 'layoutColumn') {
				tr.setNodeAttribute(layoutNodePos + offset + 1, 'width', newColumnWidth);
			}
		});
	}
	return { newColumnWidth, tr };
};
