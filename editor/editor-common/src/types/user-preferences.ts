export type UserPreferences = {
	toolbarDockingInitialPosition?: 'top' | 'none' | null;
};
export interface UserPreferencesProvider {
	/**
	 * This method updates a user preference
	 * @param key
	 * @param value
	 * @returns a promise that resolves when the preference is updated, or rejects if the update fails
	 */
	updatePreference<K extends keyof UserPreferences>(
		key: K,
		value: UserPreferences[K],
	): Promise<void>;

	/**
	 * get a user preference, Note that this function is a not async function,
	 * meaning that consumers should prefetch the user preference and make it available initially
	 * @param key
	 */
	getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] | undefined | null;
}
