/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { BaseBadgeElementProps } from './index';

export const toBadgeProps = (label?: string): Partial<BaseBadgeElementProps> | undefined => {
	// Don't render the element if its 0
	return label !== '0' && label ? { label } : undefined;
};
