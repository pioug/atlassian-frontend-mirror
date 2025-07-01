import {
	TOOLBAR_DOCKING_POSITIONS,
	type ResolvedUserPreferences,
	type UserPreferences,
} from './user-preferences';

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

/**
 * Compare two user preferences objects
 * @param {ResolvedUserPreferences} left a ResolvedUserPreferences
 * @param {ResolvedUserPreferences} right a ResolvedUserPreferences
 * @returns true if the user preferences are the same, false otherwise
 * @example
 * const userPreferences1 = {
 *   toolbarDockingPosition: 'top',
 * };
 * const userPreferences2 = {
 *   toolbarDockingPosition: 'top',
 * };
 * compareUserPreferences(userPreferences1, userPreferences2); // true
 */
export const areUserPreferencesEqual = (
	left: ResolvedUserPreferences,
	right: ResolvedUserPreferences,
): boolean => {
	return Object.entries(left).every(([key, value]) => {
		return value === right[key as keyof ResolvedUserPreferences];
	});
};
