import type { IconTileSize } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { SmartLinkSize } from '../../../constants';

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
			return undefined;
	}
};
