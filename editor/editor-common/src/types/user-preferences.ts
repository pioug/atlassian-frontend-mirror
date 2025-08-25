export type UserPreferences = {
	toolbarDockingInitialPosition?: 'top' | 'none' | null;
};
export interface UserPreferencesProvider {
	/**
	 * get a user preference, Note that this function is a not async function,
	 * meaning that consumers should prefetch the user preference and make it available initially
	 * @param key
	 */
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] | undefined | null;

	/**
	 * This method fetches the latest user preferences
	 * @returns a promise that resolves with the user preferences, or rejects if error occurs
	 */
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	loadPreferences(): Promise<UserPreferences>;

	/**
	 * This method updates a user preference
	 * @param key
	 * @param value
	 * @returns a promise that resolves when the preference is updated, or rejects if the update fails
	 */
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	updatePreference<K extends keyof UserPreferences>(
		key: K,
		value: UserPreferences[K],
	): Promise<void>;
}
