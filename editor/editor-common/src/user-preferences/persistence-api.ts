import { UserPreferences } from './user-preferences';

export type PersistenceAPI = {
	/**
	 * Loads the user preferences
	 * @returns
	 */
	loadUserPreferences: () => Promise<UserPreferences>;

	/**
	 * Update a single user preference
	 * @param key
	 * @param value
	 * @returns
	 */
	updateUserPreference: <K extends keyof UserPreferences>(
		key: K,
		value: UserPreferences[K],
	) => Promise<UserPreferences>;

	/**
	 * Get the initial user preferences synchronously
	 * This function is called on initialization
	 * If not provided, loadUserPreferences will be called instead
	 * @param userPreferences
	 * @returns
	 */
	getInitialUserPreferences?: () => UserPreferences | undefined;
};
