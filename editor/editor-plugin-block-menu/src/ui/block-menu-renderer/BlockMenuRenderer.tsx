import React, { useMemo } from 'react';

import type { RegisterBlockMenuComponent } from '../../blockMenuPluginType';

import { BlockMenuComponents } from './BlockMenuComponents';
import { BLOCK_MENU_FALLBACKS } from './fallbacks';
import type { BlockMenuFallbacks } from './types';
import { buildChildrenMap, getSortedTopLevelSections } from './utils';

type BlockMenuProps = {
	allRegisteredComponents: RegisterBlockMenuComponent[];
	fallbacks?: BlockMenuFallbacks;
};

/**
 * BlockMenuRenderer orchestrates the rendering of the entire block menu hierarchy
 */
export const BlockMenuRenderer = ({
	allRegisteredComponents,
	fallbacks = BLOCK_MENU_FALLBACKS,
}: BlockMenuProps) => {
	const { childrenMap, topLevelSections } = useMemo(
		() => ({
			childrenMap: buildChildrenMap(allRegisteredComponents),
			topLevelSections: getSortedTopLevelSections(allRegisteredComponents),
		}),
		[allRegisteredComponents],
	);

	return (
		<BlockMenuComponents
			registeredComponents={topLevelSections}
			childrenMap={childrenMap}
			fallbacks={fallbacks}
		/>
	);
};
