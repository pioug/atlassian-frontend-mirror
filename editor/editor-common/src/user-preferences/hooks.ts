import { useEffect, useState } from 'react';

import { ResolvedUserPreferences } from './user-preferences';
import { UserPreferencesProvider } from './user-preferences-provider';

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
