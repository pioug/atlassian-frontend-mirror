import { type OptionData } from '../types';
import { isCustom } from './isCustom';
import { isExternalUser } from './isExternalUser';
import { isTeam } from './isTeam';
import { isUser } from './isUser';

export const getAvatarUrl = (optionData: OptionData): string | undefined => {
	if (
		isUser(optionData) ||
		isTeam(optionData) ||
		isCustom(optionData) ||
		isExternalUser(optionData)
	) {
		return optionData.avatarUrl;
	}
	return undefined;
};
