/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { token } from '@atlaskit/tokens';

import { SmartLinkSize } from '../../../../../constants';

/**
 * Get container padding based on smart link size
 * To replace container/index.tsx getPadding() with space token for primitives
 */
export const getPrimitivesPaddingSpaceBySize = (
	size: SmartLinkSize,
):
	| 'var(--ds-space-100)'
	| 'var(--ds-space-200)'
	| 'var(--ds-space-250)'
	| 'var(--ds-space-300)' => {
	switch (size) {
		case SmartLinkSize.XLarge:
			return token('space.300');
		case SmartLinkSize.Large:
			return token('space.250');
		case SmartLinkSize.Medium:
			return token('space.200');
		case SmartLinkSize.Small:
		default:
			return token('space.100');
	}
};
