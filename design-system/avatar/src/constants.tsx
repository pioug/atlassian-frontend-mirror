import { type AvatarSizeMap } from './types';

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
