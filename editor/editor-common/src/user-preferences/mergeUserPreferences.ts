import { TOOLBAR_DOCKING_POSITIONS } from './user-preferences';
import type { ResolvedUserPreferences, UserPreferences } from './user-preferences';

export const mergeUserPreferences = (
	userPreferences: UserPreferences,
	defaultPreferences: ResolvedUserPreferences,
): ResolvedUserPreferences => {
	const newResolvedUserPreferences = {
		...defaultPreferences,
		...Object.fromEntries(
			Object.entries(userPreferences).filter(([key, value]) => {
				if (key === 'toolbarDockingPosition') {
					return TOOLBAR_DOCKING_POSITIONS.includes(value);
				}

				return value !== undefined && value !== null;
			}),
		),
	};
	return newResolvedUserPreferences;
};
