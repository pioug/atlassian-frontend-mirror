import { hash } from './hash';

enum SpaceColors {
	ORANGE_LIGHT = '#FFD5D2',
	BLUE_LIGHT = '#CFE1FD',
	YELLOW_LIGHT = '#FCE4A6',
	TEAL = '#BAF3DB',
}

const AVATAR_CONTAINER_COLORS = [
	SpaceColors.ORANGE_LIGHT,
	SpaceColors.BLUE_LIGHT,
	SpaceColors.YELLOW_LIGHT,
	SpaceColors.TEAL,
];

export const pickContainerColor = (spaceName: string): SpaceColors => {
	const avatarHash = hash(spaceName);

	return AVATAR_CONTAINER_COLORS[avatarHash % AVATAR_CONTAINER_COLORS.length];
};
