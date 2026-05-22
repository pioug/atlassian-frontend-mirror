import { fg } from '@atlaskit/platform-feature-flags';

import { type AppearanceType, type SizeType } from './types';

export const SQUARE_AVATAR_MAX_SIZE_FF = 'platform_square_avatar_remove_xlarge_xxlarge_sizes';

export const getAvatarSize = ({
	appearance,
	size,
}: {
	appearance: AppearanceType;
	size: SizeType;
}): SizeType => {
	if (
		appearance === 'square' &&
		(size === 'xlarge' || size === 'xxlarge') &&
		fg('platform_square_avatar_remove_xlarge_xxlarge_sizes')
	) {
		return 'large';
	}

	return size;
};
