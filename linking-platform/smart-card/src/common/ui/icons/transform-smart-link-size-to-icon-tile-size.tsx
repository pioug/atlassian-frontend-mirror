import type { IconTileSize } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { SmartLinkSize } from '../../../constants';

/**
 * Maps a SmartLinkSize to an IconTileSize, or undefined if the size is too
 * small to render as a tile (e.g. SmartLinkSize.Small / Medium, or no size).
 * When undefined is returned, the caller should render the icon directly
 * without a tile.
 */
export const transformSmartLinkSizeToIconTileSize = (
	size?: SmartLinkSize,
): IconTileSize | undefined => {
	if (fg('platform_sl_icons_refactor')) {
		switch (size) {
			case SmartLinkSize.Small:
			case SmartLinkSize.Medium:
				return undefined;
			case SmartLinkSize.XLarge:
			case SmartLinkSize.Large:
				return 'small';
			default:
				return undefined;
		}
	}
	switch (size) {
		case SmartLinkSize.XLarge:
		case SmartLinkSize.Large:
			return 'small';
		default:
			// SmartLinkSize.Small, SmartLinkSize.Medium, and undefined all
			// previously mapped to size="16" which has been removed. Render
			// the icon directly (no tile) for these sizes.
			return undefined;
	}
};
