import { expandSelectionToBlockRange } from '@atlaskit/editor-common/selection';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

import type { RegisterBlockMenuItem } from '../../blockMenuPluginType';
import { getBlockNodesInRange } from '../../editor-commands/transform-node-utils/utils';
import { getSortedSuggestedItems } from '../utils/suggested-items-rank';

/**
 * Pure function to calculate suggested items based on selection and menu components.
 */
export const getSuggestedItemsFromSelection = (
	menuItemsMap: Map<string, RegisterBlockMenuItem>,
	currentSelection: Selection | null | undefined,
): RegisterBlockMenuItem[] => {
	if (menuItemsMap.size === 0 || !currentSelection) {
		return [];
	}
	const { range } = expandSelectionToBlockRange(currentSelection);
	if (!range) {
		return [];
	}
	const blockNodes = getBlockNodesInRange(range);

	if (blockNodes.length === 0) {
		return [];
	}

	const firstNodeType = blockNodes[0].type.name;
	const allSameType = blockNodes.every((node) => node.type.name === firstNodeType);

	if (!allSameType) {
		return [];
	}

	const nodeTypeName = firstNodeType;
	const sortedKeys = getSortedSuggestedItems(nodeTypeName);

	return sortedKeys
		.map((key) => menuItemsMap.get(key))
		.filter((item): item is RegisterBlockMenuItem => item !== undefined);
};
