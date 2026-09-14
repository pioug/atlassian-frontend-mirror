import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { nodeMargins, spacingBetweenNodesForPreview } from './consts';

export const buildLayoutColumnMenuMeta = (
	anchorPos: number,
	openedViaKeyboard: boolean,
): { anchorPos: number; isOpen?: true; openedViaKeyboard: boolean } => ({
	anchorPos,
	...(fg('platform_editor_layout_column_menu_kill_switch_1') ? { isOpen: true } : {}),
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
