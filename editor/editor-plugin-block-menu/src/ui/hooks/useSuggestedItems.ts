import { useMemo } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockMenuPlugin, RegisterBlockMenuItem } from '../../blockMenuPluginType';
import { createMenuItemsMap } from '../utils/createMenuItemsMap';
import { getSuggestedItemsFromSelection } from '../utils/getSuggestedItemsFromSelection';

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
		return createMenuItemsMap(blockMenuComponents);
	}, [blockMenuComponents]);

	const suggestedItems = useMemo(() => {
		const currentSelection = preservedSelection || selection;
		return getSuggestedItemsFromSelection(menuItemsMap, currentSelection);
	}, [menuItemsMap, preservedSelection, selection]);

	return suggestedItems;
};
