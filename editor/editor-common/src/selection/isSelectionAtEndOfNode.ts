import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';

export const isSelectionAtEndOfNode = ($pos: ResolvedPos, parentNode?: PMNode): boolean => {
	if (!parentNode) {
		return false;
	}

	for (let i = $pos.depth + 1; i > 0; i--) {
		const node = $pos.node(i);
		if (node && node.eq(parentNode)) {
			break;
		}

		if (i > 1 && $pos.after(i) !== $pos.after(i - 1) - 1) {
			return false;
		}
	}

	return true;
};
