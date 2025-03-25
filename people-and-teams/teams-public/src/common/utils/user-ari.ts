import { USER_ARI_PREFIX, type UserARI } from '../types';

export const isUserARI = (ari: string): ari is UserARI => ari.startsWith(USER_ARI_PREFIX);

export const toUserId = (ari: UserARI | string): string => {
	if (isUserARI(ari)) {
		return ari.replace(USER_ARI_PREFIX, '');
	}
	throw new Error('Invalid UserARI');
};
