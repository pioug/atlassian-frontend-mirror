/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { BaseAvatarGroupElementProps, BaseAvatarItemProps } from './index';

export const toAvatarGroupProps = (
	items?: BaseAvatarItemProps[],
	showFallbackAvatar?: boolean,
): Partial<BaseAvatarGroupElementProps> | undefined => {
	return items ? { items } : showFallbackAvatar ? { items: [] } : undefined;
};
