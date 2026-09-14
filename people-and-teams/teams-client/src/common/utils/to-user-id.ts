import { USER_ARI_PREFIX, type UserARI } from '../types';

import { isUserARI } from './is-user-ari';

export const toUserId = (ari: UserARI | string): string => {
	if (isUserARI(ari)) {
		return ari.replace(USER_ARI_PREFIX, '');
	}
	throw new Error('Invalid UserARI');
};
