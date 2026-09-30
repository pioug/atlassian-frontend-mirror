import type { IconTileSize } from '@atlaskit/icon/types';

import { SmartLinkSize } from '../../../constants';

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
