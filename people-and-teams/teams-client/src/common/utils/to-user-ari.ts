import { USER_ARI_PREFIX, type UserARI } from '../types';

import { isUserARI } from './is-user-ari';

export const toUserARI = (userId: string): UserARI => {
	return isUserARI(userId) ? userId : (`${USER_ARI_PREFIX}${userId}` as UserARI);
};
