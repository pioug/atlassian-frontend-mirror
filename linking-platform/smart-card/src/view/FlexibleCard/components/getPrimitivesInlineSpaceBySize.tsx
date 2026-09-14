import type { Space } from '@atlaskit/primitives/compiled';

import { SmartLinkSize } from '../../../constants';

/**
 * A space between element based on smart link size
 * To replace blocks/utils.tsz getGapSize() with space token for primitives
 */
export const getPrimitivesInlineSpaceBySize = (size: SmartLinkSize): Space => {
	switch (size) {
		case SmartLinkSize.XLarge:
			return 'space.250';
		case SmartLinkSize.Large:
			return 'space.200';
		case SmartLinkSize.Medium:
			return 'space.100';
		case SmartLinkSize.Small:
		default:
			return 'space.050';
	}
};
