import { type PersistenceAPI } from './persistence-api';
import { type ResolvedUserPreferences, type UserPreferences } from './user-preferences';
import { areUserPreferencesEqual, mergeUserPreferences } from './utils';

type UpdateCallback = (userPreferences: UserPreferences) => void;

/**
 * This class is used to manage user preferences in the editor.
 * It provides methods to load, update, and get user preferences,
 * as well as a way to subscribe to updates.
 * @example const userPreferencesProvider = new UserPreferencesProvider(persistenceAPI, defaultPreferences);
 */
export class UserPreferencesProvider {
	private updateCallbacks: Array<UpdateCallback> = [];
	private userPreferences: UserPreferences = {};
	private defaultPreferences: ResolvedUserPreferences;
	private resolvedUserPreferences: ResolvedUserPreferences;
	private initialized = false;
	private persistenceAPI: PersistenceAPI;

	/**
	 * This is the constructor for the UserPreferencesProvider class.
	 * @param persistenceAPI - The persistence API to use for loading and updating user preferences
	 * @param defaultPreferences - The default user preferences to use
	 * @param initialUserPreferences - The initial user preferences to use (optional)
	 * @example const userPreferencesProvider = new UserPreferencesProvider(persistenceAPI, defaultPreferences);
	 */
	constructor(persistenceAPI: PersistenceAPI, defaultPreferences: ResolvedUserPreferences) {
		this.persistenceAPI = persistenceAPI;
		this.defaultPreferences = defaultPreferences;
		this.resolvedUserPreferences = defaultPreferences;

		const initialUserPreferences = this.persistenceAPI.getInitialUserPreferences?.();
		if (initialUserPreferences) {
			this.setUserPreferences(initialUserPreferences);
		}
		// the initial user preferences might come from the local cache,
		// so we need to always load the preferences
		this.loadPreferences();
	}

	/**
	 * This method returns the initialized state of the user preferences provider
	 * @returns true if the user preferences provider is initialized, false otherwise
	 * @example userPreferencesProvider.isInitialized
	 */
	get isInitialized() {
		return this.initialized;
	}

	/**
	 * This method fetches the latest user preferences
	 * @returns a promise that resolves with the user preferences, or rejects if error occurs
	 * @throws Error if there is an error loading user preferences
	 * @example userPreferencesProvider.loadPreferences()
	 */
	public async loadPreferences(): Promise<void> {
		const userPreferences = await this.persistenceAPI.loadUserPreferences();
		this.setUserPreferences(userPreferences);
	}

	/**
	 * This method updates a user preference
	 * @param key
	 * @param value
	 * @returns a promise that resolves when the user preference is updated
	 * @throws Error if there is an error updating user preferences
	 * @example userPreferencesProvider.updatePreference('toolbarDockingPosition', 'top')
	 */
	public async updatePreference<K extends keyof UserPreferences>(
		key: K,
		value: UserPreferences[K],
	): Promise<void> {
		const userPreferences = await this.persistenceAPI.updateUserPreference(key, value);
		this.setUserPreferences(userPreferences);
	}

	/**
	 * get a user preference, Note that this function is a not async function,
	 * meaning that consumers should prefetch the user preference and make it available initially
	 * @param key
	 * @returns the user preference
	 * @example userPreferencesProvider.getPreference('toolbarDockingPosition')
	 */
	getPreference<K extends keyof ResolvedUserPreferences>(key: K): ResolvedUserPreferences[K] {
		return this.resolvedUserPreferences[key];
	}

	/**
	 * get all user preferences
	 * @returns the user preferences
	 * @example userPreferencesProvider.getPreferences()
	 */
	getPreferences(): ResolvedUserPreferences {
		return this.resolvedUserPreferences;
	}

	/**
	 * This method fetches the latest user preferences
	 * @param onUpdate
	 * @returns a function to unsubscribe from the updates
	 * @example
	 */
	public onUpdate(onUpdate: UpdateCallback): () => void {
		this.updateCallbacks.push(onUpdate);

		// Return the cleanup function to unsubscribe from the updates
		return () => {
			this.updateCallbacks = this.updateCallbacks.filter((callback) => callback !== onUpdate);
		};
	}

	/**
	 * This method is used to set the default user preferences,
	 * setting the default user preferences will also trigger an update
	 * This is useful when the default user preferences dynamically based on the context
	 * @param preferences
	 * @example
	 */
	setDefaultPreferences(preferences: ResolvedUserPreferences): void {
		this.defaultPreferences = preferences;
		const hasUpdated = this.resolveUserPreferences();
		if (hasUpdated) {
			this.notifyUserPreferencesUpdated();
		}
	}

	private setUserPreferences(userPreferences: UserPreferences) {
		this.userPreferences = userPreferences;
		const hasUpdated = this.resolveUserPreferences();
		if (hasUpdated || !this.initialized) {
			if (!this.initialized) {
				this.initialized = true;
			}
			this.notifyUserPreferencesUpdated();
		}
	}

	/**
	 * This method is used to notify the user preferences updated
	 * @example userPreferencesProvider.notifyUserPreferencesUpdated()
	 */
	notifyUserPreferencesUpdated(): void {
		this.updateCallbacks.forEach((callback) => {
			callback(this.resolvedUserPreferences);
		});
	}

	/**
	 * This method resolves the user preferences by merging the default preferences
	 * with the user preferences and filtering out any undefined or null values
	 * to avoid overwriting default preferences with null values
	 * @returns true if the user preferences were updated, false otherwise
	 * @example userPreferencesProvider.resolveUserPreferences()
	 */
	private resolveUserPreferences(): boolean {
		// Merge default preferences with user preferences
		// and filter out any undefined or null values
		// to avoid overwriting default preferences with null values
		const newResolvedUserPreferences = mergeUserPreferences(
			this.userPreferences,
			this.defaultPreferences,
		);

		// if the user preferences is NOT initialized, we need to update and notify
		// the user preferences
		// if the user preferences is initialized, we need to check if the new user preferences
		// is different from the old user preferences
		const isSame = areUserPreferencesEqual(
			newResolvedUserPreferences,
			this.resolvedUserPreferences,
		);

		const needUpdate = !isSame;

		if (needUpdate) {
			this.resolvedUserPreferences = newResolvedUserPreferences;
		}

		return needUpdate;
	}
}
