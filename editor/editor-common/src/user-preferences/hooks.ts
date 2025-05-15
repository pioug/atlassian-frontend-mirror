import { useEffect, useState } from 'react';

import { type ResolvedUserPreferences } from './user-preferences';
import { UserPreferencesProvider } from './user-preferences-provider';

/**
 *
 * @param userPreferencesProvider
 * @example
 */
export function useResolvedUserPreferences(userPreferencesProvider: UserPreferencesProvider) {
	const [resolvedUserPreferences, setResolvedUserPreferences] = useState<ResolvedUserPreferences>(
		userPreferencesProvider.getPreferences(),
	);

	useEffect(() => {
		return userPreferencesProvider.onUpdate(() => {
			setResolvedUserPreferences(userPreferencesProvider.getPreferences());
		});
	}, [userPreferencesProvider]);

	return { resolvedUserPreferences };
}
