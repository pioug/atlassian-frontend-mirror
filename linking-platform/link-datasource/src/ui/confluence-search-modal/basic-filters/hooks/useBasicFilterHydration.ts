import { useCallback, useState } from 'react';

import { useBasicFilterAGG } from '../../../../services/useBasicFilterAGG';
import {
	type CommonBasicFilterHookState,
	type SelectOption,
} from '../../../common/modal/popup-select/types';
import { type UserHydrationAGGResponse } from '../types';

export interface BasicFilterHydrationState extends Omit<CommonBasicFilterHookState, 'errors'> {
	hydrateUsersFromAccountIds: (accountIds: string[]) => void;
	reset: () => void;
	users: SelectOption[];
}

export const useBasicFilterHydration = (): BasicFilterHydrationState => {
	const [status, setStatus] = useState<BasicFilterHydrationState['status']>('empty');
	const { getUsersFromAccountIDs } = useBasicFilterAGG();
	const [users, setUsers] = useState<SelectOption[]>([]);

	const convertUserHydrationResponseToFilterOptions = (
		response: UserHydrationAGGResponse,
	): SelectOption[] => {
		if (!response.data?.users) {
			return [];
		}

		return response.data?.users.map((item) => ({
			optionType: 'avatarLabel',
			label: item.name,
			value: item.accountId,
			avatar: item.picture,
		}));
	};

	const hydrateUsersFromAccountIds = useCallback(
		async (accountIds: string[]) => {
			try {
				setStatus('loading');
				const response = await getUsersFromAccountIDs(accountIds);

				if (response.errors && response.errors.length > 0) {
					throw new Error(JSON.stringify(response.errors));
				}

				setUsers(convertUserHydrationResponseToFilterOptions(response));
				setStatus('resolved');
			} catch (error) {
				setStatus('rejected');
			}
		},
		[getUsersFromAccountIDs],
	);

	const reset = useCallback(() => {
		setStatus('empty');
		setUsers([]);
	}, []);

	return {
		hydrateUsersFromAccountIds,
		status,
		users,
		reset,
	};
};
