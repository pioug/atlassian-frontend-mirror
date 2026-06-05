import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { floatingLayouts } from '../utils/floatingLayouts';
import { isRichMediaInsideOfBlockNode } from '../utils/isRichMediaInsideOfBlockNode';

/**
 * Get parent width for a nested media single node
 * @param view Editor view
 * @param pos node position
 */
export const getMaxWidthForNestedNode = (
	view: EditorView,
	pos: number | undefined,
): number | null => {
	if (typeof pos !== 'number') {
		return null;
	}
	if (isRichMediaInsideOfBlockNode(view, pos)) {
		const $pos = view.state.doc.resolve(pos);
		const domNode = view.nodeDOM($pos.pos);

		if (
			$pos.nodeAfter &&
			floatingLayouts.indexOf($pos.nodeAfter.attrs.layout) > -1 &&
			domNode &&
			domNode.parentElement
		) {
			return domNode.parentElement.offsetWidth;
		}

		if (domNode instanceof HTMLElement) {
			return domNode.offsetWidth;
		}
	}

	return null;
};
