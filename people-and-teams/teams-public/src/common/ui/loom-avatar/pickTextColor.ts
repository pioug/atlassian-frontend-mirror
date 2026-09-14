import { hash } from './hash';

enum AvatarTextColors {
	ORANGE_DARK = '#AE2E24',
	BLUE_DARK = '#123263',
	YELLOW_DARK = '#9E4C00',
	TEAL_DARK = '#164B35',
}

const AVATAR_TEXT_COLORS = [
	AvatarTextColors.ORANGE_DARK,
	AvatarTextColors.BLUE_DARK,
	AvatarTextColors.YELLOW_DARK,
	AvatarTextColors.TEAL_DARK,
];

export const pickTextColor = (spaceName: string): AvatarTextColors => {
	const avatarHash = hash(spaceName);

	return AVATAR_TEXT_COLORS[avatarHash % AVATAR_TEXT_COLORS.length];
};
