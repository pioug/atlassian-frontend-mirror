import { token } from '@atlaskit/tokens';

import { SmartLinkSize } from '../../../constants';

export const getIconWidth = (size?: SmartLinkSize): string => {
	switch (size) {
		case SmartLinkSize.XLarge:
		case SmartLinkSize.Large:
			return token('space.300', '24px');
		case SmartLinkSize.Medium:
		case SmartLinkSize.Small:
		default:
			return token('space.200', '16px');
	}
};
