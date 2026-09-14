import type { Spacing } from '@atlaskit/button/old-button/types';

import { SmartLinkSize } from '../../../constants';

export const sizeToButtonSpacing: Record<SmartLinkSize, Spacing> = {
	[SmartLinkSize.Small]: 'none',
	[SmartLinkSize.Medium]: 'compact',
	[SmartLinkSize.Large]: 'compact',
	[SmartLinkSize.XLarge]: 'default',
};
