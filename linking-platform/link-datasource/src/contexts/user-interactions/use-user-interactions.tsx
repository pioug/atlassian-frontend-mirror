import { useContext } from 'react';

import { type UserInteractions } from './types';
import { UserInteractionsContext } from './user-interactions-context';

/**
 * Use this hook to track user activities. This is mainly used to populate analytic events with
 * a trail of user activities.
 *
 * @returns an object that can track datasource actions and retrieve the actions that have been tracked.
 */
export const useUserInteractions = (): UserInteractions => {
	const context = useContext(UserInteractionsContext);
	if (!context) {
		throw new Error('useUserInteractions() must be wrapped in <UserInteractionsProvider>');
	}
	return context;
};
