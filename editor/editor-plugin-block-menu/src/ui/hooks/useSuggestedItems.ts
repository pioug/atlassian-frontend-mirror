import { useMemo } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { expandSelectionToBlockRange } from '@atlaskit/editor-common/selection';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockMenuPlugin, RegisterBlockMenuItem } from '../../blockMenuPluginType';
import { getBlockNodesInRange } from '../../editor-commands/transform-node-utils/utils';
import { getSortedSuggestedItems } from '../utils/suggested-items-rank';

export const useSuggestedItems = (
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
): RegisterBlockMenuItem[] => {
	const { preservedSelection, selection } = useSharedPluginStateWithSelector(
		api,
		['blockControls', 'selection'],
		(states) => ({
			preservedSelection: states.blockControlsState?.preservedSelection,
			selection: states.selectionState?.selection,
		}),
	);
	const blockMenuComponents = api?.blockMenu?.actions.getBlockMenuComponents();

	const menuItemsMap = useMemo(() => {
		if (!blockMenuComponents) {
			return new Map<string, RegisterBlockMenuItem>();
		}

		return new Map(
			blockMenuComponents
				.filter((c): c is RegisterBlockMenuItem => c.type === 'block-menu-item')
				.map((item) => [item.key, item]),
		);
	}, [blockMenuComponents]);

	const suggestedItems = useMemo(() => {
		const currentSelection = preservedSelection || selection;

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
	}, [menuItemsMap, preservedSelection, selection]);

	return suggestedItems;
};
