import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { nodeMargins, spacingBetweenNodesForPreview } from './consts';

export const buildLayoutColumnMenuMeta = (
	anchorPos: number,
	openedViaKeyboard: boolean,
): { anchorPos: number; openedViaKeyboard: boolean } => ({
	anchorPos,
	openedViaKeyboard,
});

export const getNodeSpacingForDragPreview = (
	node?: PMNode | null,
): { bottom: string; top: string } => {
	if (!node) {
		return spacingBetweenNodesForPreview.default;
	}
	const nodeTypeName = node.type.name;
	if (nodeTypeName === 'heading') {
		return (
			spacingBetweenNodesForPreview[`heading${node.attrs.level}`] ??
			spacingBetweenNodesForPreview.default
		);
	}

	return spacingBetweenNodesForPreview[nodeTypeName] ?? spacingBetweenNodesForPreview.default;
};

export const getNodeMarginsForDragPreview = (
	node?: PMNode | null,
): { bottom: number; top: number } => {
	if (!node) {
		return nodeMargins.default;
	}
	const nodeTypeName = node.type.name;
	if (nodeTypeName === 'heading') {
		return nodeMargins[`heading${node.attrs.level}`] ?? nodeMargins.default;
	}

	return nodeMargins[nodeTypeName] ?? nodeMargins.default;
};
