const stringHash = require('string-hash');

enum SpaceColors {
	ORANGE_LIGHT = '#FFD5D2',
	BLUE_LIGHT = '#CFE1FD',
	YELLOW_LIGHT = '#FCE4A6',
	TEAL = '#BAF3DB',
}

enum AvatarTextColors {
	ORANGE_DARK = '#AE2E24',
	BLUE_DARK = '#123263',
	YELLOW_DARK = '#9E4C00',
	TEAL_DARK = '#164B35',
}

const AVATAR_CONTAINER_COLORS = [
	SpaceColors.ORANGE_LIGHT,
	SpaceColors.BLUE_LIGHT,
	SpaceColors.YELLOW_LIGHT,
	SpaceColors.TEAL,
];

const AVATAR_TEXT_COLORS = [
	AvatarTextColors.ORANGE_DARK,
	AvatarTextColors.BLUE_DARK,
	AvatarTextColors.YELLOW_DARK,
	AvatarTextColors.TEAL_DARK,
];

const hash = (str: string): number => {
	let hash = stringHash(str);

	hash = ~hash;

	return Math.abs(Number(hash));
};

export const getAvatarText = (spaceName: string): string => {
	return spaceName?.trim().length ? spaceName.trim()[0].toUpperCase() : '';
};

export const pickContainerColor = (spaceName: string): SpaceColors => {
	const avatarHash = hash(spaceName);

	return AVATAR_CONTAINER_COLORS[avatarHash % AVATAR_CONTAINER_COLORS.length];
};

export const pickTextColor = (spaceName: string): AvatarTextColors => {
	const avatarHash = hash(spaceName);

	return AVATAR_TEXT_COLORS[avatarHash % AVATAR_TEXT_COLORS.length];
};
