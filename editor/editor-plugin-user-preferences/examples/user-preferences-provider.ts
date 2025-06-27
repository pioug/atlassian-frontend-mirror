import {
	UserPreferencesProvider,
	type UserPreferences,
	type ResolvedUserPreferences,
	type PersistenceAPI,
} from '@atlaskit/editor-common/user-preferences';

const DEFAULT_USER_PREFERENCES = {
	toolbarDockingPosition: 'top',
} as ResolvedUserPreferences;

class inMemoryAPI implements PersistenceAPI {
	private userPreferences: UserPreferences = {};

	constructor() {
		this.userPreferences = DEFAULT_USER_PREFERENCES;
	}

	getInitialUserPreferences = () => {
		return this.userPreferences;
	};

	loadUserPreferences = async () => {
		return await this.userPreferences;
	};

	updateUserPreference = async (key: keyof UserPreferences, value: UserPreferences[typeof key]) => {
		this.userPreferences[key] = value;
		return await this.userPreferences;
	};
}

export const getUserPreferencesProvider = (
	defaultUserPref: ResolvedUserPreferences = DEFAULT_USER_PREFERENCES,
) => {
	const userPreferencesProvider = new UserPreferencesProvider(new inMemoryAPI(), defaultUserPref);

	return userPreferencesProvider;
};
