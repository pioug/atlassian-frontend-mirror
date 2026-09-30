import type { IconTileSize } from '@atlaskit/icon/types';

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
};
