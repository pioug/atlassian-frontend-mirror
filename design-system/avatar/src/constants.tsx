import { type AvatarSizeMap, type IndicatorSizeType } from './types';

export const AVATAR_SIZES: AvatarSizeMap = {
	xsmall: 16,
	small: 24,
	medium: 32,
	large: 40,
	xlarge: 96,
	xxlarge: 128,
};

// border radius only applies to "square" avatars
export const AVATAR_RADIUS: AvatarSizeMap = {
	xsmall: 2,
	small: 2,
	medium: 3,
	large: 3,
	xlarge: 6,
	xxlarge: 12,
};

export const BORDER_WIDTH = 2;
export const ACTIVE_SCALE_FACTOR = 0.9;

export const CSS_VAR_AVATAR_BGCOLOR = '--avatar-background-color';

export const ICON_SIZES: Record<IndicatorSizeType, number> = {
	small: 12,
	medium: 14,
	large: 15,
	xlarge: 18,
};

export const ICON_OFFSET: Record<IndicatorSizeType, number> = {
	small: 0,
	medium: 0,
	large: 1,
	xlarge: 7,
};
