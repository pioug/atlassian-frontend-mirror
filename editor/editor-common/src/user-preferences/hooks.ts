import { useEffect, useState } from 'react';

import { type ResolvedUserPreferences } from './user-preferences';
import type { UserPreferencesProvider } from './user-preferences-provider';

/**
 * This hook returns the latest user preference
 * @param {UserPreferencesProvider} userPreferencesProvider an instance of UserPreferencesProvider
 * @example const { resolvedUserPreferences } = edUserPreferences(userPreferencesProvider)
 * @returns {ResolvedUserPreferences | null} the latest user preference
 */
export function useResolvedUserPreferences(userPreferencesProvider?: UserPreferencesProvider) {
	const [resolvedUserPreferences, setResolvedUserPreferences] =
		useState<ResolvedUserPreferences | null>(userPreferencesProvider?.getPreferences() || null);

	useEffect(() => {
		return userPreferencesProvider?.onUpdate(() => {
			setResolvedUserPreferences(userPreferencesProvider.getPreferences());
		});
	}, [userPreferencesProvider]);

	return { resolvedUserPreferences };
}
