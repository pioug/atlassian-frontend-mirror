import React, { useMemo } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

import type { BlockMenuPlugin, RegisterBlockMenuItem } from '../blockMenuPluginType';
import { getSelectedNode } from '../editor-commands/transform-node-utils/utils';

import { getSortedSuggestedItems } from './utils/suggested-items-rank';

type SuggestedItemsRendererProps = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
};

export const SuggestedItemsRenderer = React.memo<SuggestedItemsRendererProps>(({ api }) => {
	const { preservedSelection } = useSharedPluginStateWithSelector(
		api,
		['blockControls'],
		(states) => ({
			preservedSelection: states.blockControlsState?.preservedSelection,
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
		if (!preservedSelection || menuItemsMap.size === 0) {
			return [];
		}

		const selectedNode = getSelectedNode(preservedSelection);
		if (!selectedNode) {
			return [];
		}

		const nodeTypeName = selectedNode.node.type.name;
		const sortedKeys = getSortedSuggestedItems(nodeTypeName);

		return sortedKeys
			.map((key) => menuItemsMap.get(key))
			.filter((item): item is RegisterBlockMenuItem => item !== undefined);
	}, [menuItemsMap, preservedSelection]);

	if (suggestedItems.length === 0) {
		return null;
	}

	return (
		<ToolbarDropdownItemSection title="Suggested">
			{suggestedItems.map((item) => {
				const ItemComponent = item.component;
				return ItemComponent ? <ItemComponent key={item.key} /> : null;
			})}
		</ToolbarDropdownItemSection>
	);
});
