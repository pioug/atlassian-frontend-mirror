import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export const isContentEmpty = (node: PMNode): boolean => {
	if (node.content.childCount === 0) {
		return true;
	}

	if (node.type.name === 'blockTaskItem') {
		return (
			node.content.childCount === 1 &&
			node.content.firstChild?.type.name === 'paragraph' &&
			node.content.firstChild?.childCount === 0
		);
	}

	return false;
};
