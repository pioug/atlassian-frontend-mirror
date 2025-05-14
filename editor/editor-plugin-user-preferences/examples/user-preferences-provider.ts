import {
	UserPreferencesProvider,
	UserPreferences,
	ResolvedUserPreferences,
} from '@atlaskit/editor-common/user-preferences';

const DEFAULT_USER_PREFERENCES = {
	toolbarDockingPosition: 'top',
} as ResolvedUserPreferences;

const storageKey = 'editor-user-settings';

export const getUserPreferencesProvider = () => {
	const loadUserPreferencesSync = () => {
		const storedPreferences = localStorage.getItem(storageKey);
		if (storedPreferences) {
			return JSON.parse(storedPreferences);
		}
		return DEFAULT_USER_PREFERENCES;
	};

	const loadUserPreferences = () => {
		return Promise.resolve(loadUserPreferencesSync());
	};

	const updateUserPreferences = <K extends keyof UserPreferences>(
		key: K,
		value: UserPreferences[K],
	) => {
		const storedPreferences = JSON.parse(localStorage.getItem(storageKey) || '{}');

		const updatedPreferences = {
			...storedPreferences,
			[key]: value,
		};

		localStorage.setItem(storageKey, JSON.stringify(updatedPreferences));
		return Promise.resolve(updatedPreferences);
	};

	const persistenceAPI = {
		loadUserPreferences,
		updateUserPreference: updateUserPreferences,
		getInitialUserPreferences: loadUserPreferencesSync,
	};

	const userPreferencesProvider = new UserPreferencesProvider(
		persistenceAPI,
		DEFAULT_USER_PREFERENCES,
	);

	return userPreferencesProvider;
};
