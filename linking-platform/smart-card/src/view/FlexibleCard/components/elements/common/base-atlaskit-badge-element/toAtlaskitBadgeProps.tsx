/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { BaseAtlaskitBadgeElementProps } from './index';

export const toAtlaskitBadgeProps = (
	value?: number,
): Partial<BaseAtlaskitBadgeElementProps> | undefined => {
	return value ? { value } : undefined;
};
