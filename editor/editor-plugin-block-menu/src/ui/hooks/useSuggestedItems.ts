import { useMemo } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockMenuPlugin, RegisterBlockMenuItem } from '../../blockMenuPluginType';
import { getBlockNodesInRange, expandSelectionToBlockRange } from '../../editor-commands/transform-node-utils/utils';
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
		const { range } = expandSelectionToBlockRange(currentSelection, currentSelection.$from.doc.type.schema);
		if (!range) {
			return [];
		}
		const blockNodes = getBlockNodesInRange(range);
		const singleNode = blockNodes.length === 1 ? blockNodes[0] : undefined;
		if (!singleNode) {
			return [];
		}

		const nodeTypeName = singleNode.type.name;
		const sortedKeys = getSortedSuggestedItems(nodeTypeName);

		return sortedKeys
			.map((key) => menuItemsMap.get(key))
			.filter((item): item is RegisterBlockMenuItem => item !== undefined);
	}, [menuItemsMap, preservedSelection, selection]);

	return suggestedItems;
};

