import { isEmptyParagraph } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export const isEmptyLayout = (node?: PMNode): boolean => {
	if (!node) {
		return false;
	}
	// fast check
	// each column should have size 2 from layoutcolumn and 2 from empty paragraph
	if (node.content.size / node.childCount !== 4) {
		return false;
	}

	let isEmpty = true;

	node.content.forEach((maybelayoutColumn) => {
		if (
			maybelayoutColumn.type.name !== 'layoutColumn' ||
			maybelayoutColumn.childCount > 1 ||
			!isEmptyParagraph(maybelayoutColumn.firstChild)
		) {
			isEmpty = false;
		}
	});

	return isEmpty;
};
