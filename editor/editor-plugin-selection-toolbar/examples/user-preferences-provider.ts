import type { UserPreferences, UserPreferencesProvider } from '@atlaskit/editor-common/types';
const DEFAULT_USER_PREFERENCES = {
	toolbarDockingInitialPosition: 'top',
} as UserPreferences;
export class LocalUserPreferencesProvider implements UserPreferencesProvider {
	private storageKey = 'editor-user-settings';

	private getStoredPreferences(): UserPreferences {
		const storedPreferences = localStorage.getItem(this.storageKey);
		return storedPreferences ? JSON.parse(storedPreferences) : DEFAULT_USER_PREFERENCES;
	}

	public loadPreferences(): Promise<UserPreferences> {
		const storedPreferences = localStorage.getItem(this.storageKey);
		if (storedPreferences) {
			return Promise.resolve(JSON.parse(storedPreferences));
		}
		return Promise.resolve(DEFAULT_USER_PREFERENCES);
	}

	private savePreferences(preferences: UserPreferences) {
		localStorage.setItem(this.storageKey, JSON.stringify(preferences));
	}

	updatePreference<K extends keyof UserPreferences>(
		key: K,
		value: UserPreferences[K],
	): Promise<void> {
		const preferences = this.getStoredPreferences();
		preferences[key] = value;
		this.savePreferences(preferences);
		return Promise.resolve();
	}

	getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] | undefined | null {
		const preferences = this.getStoredPreferences();
		return preferences[key];
	}
}
