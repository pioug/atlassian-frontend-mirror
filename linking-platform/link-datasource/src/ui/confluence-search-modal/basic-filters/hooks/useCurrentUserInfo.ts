import { useCallback, useEffect, useState } from 'react';

import { useBasicFilterAGG } from '../../../../services/useBasicFilterAGG';
import { type UserInfo } from '../types';

interface useUserInfoState {
	user?: UserInfo;
	getCurrentUserInfo: () => Promise<void>;
}

export const useCurrentUserInfo = (): useUserInfoState => {
	const [user, setUser] = useState<UserInfo>();
	const { getCurrentUserInfo: getCurrentUserInfoFromAGG } = useBasicFilterAGG();

	const getCurrentUserInfo = useCallback(async () => {
		const user = await getCurrentUserInfoFromAGG();

		setUser(user.data?.me?.user);
	}, [getCurrentUserInfoFromAGG]);

	useEffect(() => {
		getCurrentUserInfo();
	}, [getCurrentUserInfo]);

	return { user, getCurrentUserInfo };
};
