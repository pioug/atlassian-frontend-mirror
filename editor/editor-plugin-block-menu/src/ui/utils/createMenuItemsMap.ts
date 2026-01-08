import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockMenuPlugin, RegisterBlockMenuItem } from '../../blockMenuPluginType';

/**
 * Helper function to create menu items map from block menu components.
 */
export const createMenuItemsMap = (
	blockMenuComponents:
		| ReturnType<
				ExtractInjectionAPI<BlockMenuPlugin>['blockMenu']['actions']['getBlockMenuComponents']
		  >
		| undefined,
): Map<string, RegisterBlockMenuItem> => {
	if (!blockMenuComponents) {
		return new Map<string, RegisterBlockMenuItem>();
	}

	return new Map(
		blockMenuComponents
			.filter((c): c is RegisterBlockMenuItem => c.type === 'block-menu-item')
			.map((item) => [item.key, item]),
	);
};
