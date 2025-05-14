import { PersistenceAPI } from './persistence-api';
import { ResolvedUserPreferences, UserPreferences } from './user-preferences';

type UpdateCallback = (userPreferences: UserPreferences) => void;

export class UserPreferencesProvider {
	private callbacks: Array<UpdateCallback> = [];
	private userPreferences: UserPreferences = {};
	private defaultPreferences: ResolvedUserPreferences;
	private resolvedUserPreferences: ResolvedUserPreferences;
	private initialized = false;
	private persistenceAPI: PersistenceAPI;

	/**
	 * @param persistenceAPI - The persistence API to use for loading and updating user preferences
	 * @param defaultPreferences - The default user preferences to use
	 * @param initialUserPreferences - The initial user preferences to use (optional)
	 */
	constructor(persistenceAPI: PersistenceAPI, defaultPreferences: ResolvedUserPreferences) {
		this.persistenceAPI = persistenceAPI;
		this.defaultPreferences = defaultPreferences;
		this.resolvedUserPreferences = defaultPreferences;

		const initialUserPreferences = this.persistenceAPI.getInitialUserPreferences?.();
		if (initialUserPreferences) {
			this.setUserPreferences(initialUserPreferences);
		} else {
			this.loadPreferences();
		}
	}

	get isInitialized() {
		return this.initialized;
	}

	/**
	 * This method fetches the latest user preferences
	 * @returns a promise that resolves with the user preferences, or rejects if error occurs
	 * @throws Error if there is an error loading user preferences
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
	 */
	getPreference<K extends keyof ResolvedUserPreferences>(key: K): ResolvedUserPreferences[K] {
		return this.resolvedUserPreferences[key];
	}

	/**
	 * get all user preferences
	 */
	getPreferences(): ResolvedUserPreferences {
		return this.resolvedUserPreferences;
	}

	/**
	 * This method fetches the latest user preferences
	 * @returns a function to unsubscribe from the updates
	 */
	public onUpdate(onUpdate: UpdateCallback): () => void {
		this.callbacks.push(onUpdate);

		// Return the cleanup function to unsubscribe from the updates
		return () => {
			this.callbacks = this.callbacks.filter((callback) => callback !== onUpdate);
		};
	}

	/**
	 * This method is used to set the default user preferences,
	 * setting the default user preferences will also trigger an update
	 * This is useful when the default user preferences dynamically based on the context
	 * @param preferences
	 */
	setDefaultPreferences(preferences: ResolvedUserPreferences) {
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
			this.notifyUserPreferencesUpdated();
		}
		if (!this.initialized) {
			this.initialized = true;
		}
	}

	notifyUserPreferencesUpdated() {
		this.callbacks.forEach((callback) => {
			callback(this.resolvedUserPreferences);
		});
	}

	/**
	 * This method resolves the user preferences by merging the default preferences
	 * with the user preferences and filtering out any undefined or null values
	 * to avoid overwriting default preferences with null values
	 * @returns true if the user preferences were updated, false otherwise
	 */
	private resolveUserPreferences(): boolean {
		// Merge default preferences with user preferences
		// and filter out any undefined or null values
		// to avoid overwriting default preferences with null values
		const newResolvedUserPreferences = {
			...this.defaultPreferences,
			...Object.fromEntries(
				Object.entries(this.userPreferences).filter(([, v]) => v !== undefined && v !== null),
			),
		};

		// if the user preferences is NOT initialized, we need to update and notify
		// the user preferences
		// if the user preferences is initialized, we need to check if the new user preferences
		// is different from the old user preferences
		const needUpdate = Object.entries(newResolvedUserPreferences).some(([key, value]) => {
			return value !== this.resolvedUserPreferences[key as keyof ResolvedUserPreferences];
		});

		if (needUpdate) {
			this.resolvedUserPreferences = newResolvedUserPreferences;
		}

		return needUpdate;
	}
}
