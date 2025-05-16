export interface UserPreferences {
	set: (key: string, value: string) => void;
	get: (key: string) => string | null | undefined;
}

// Currently only supports boolean, string. Uncomment below to support number
const MediaUserPreferencesTypes = {
	videoCaptionsEnabled: 'boolean',
	videoCaptionsPreferredLocale: 'string',
} as const;

type MediaUserPreferencesTypeMap = {
	[K in keyof typeof MediaUserPreferencesTypes]: (typeof MediaUserPreferencesTypes)[K] extends 'boolean'
		? boolean
		: (typeof MediaUserPreferencesTypes)[K] extends 'number'
			? number
			: string;
};

export interface MediaUserPreferences {
	set: <K extends keyof typeof MediaUserPreferencesTypes>(
		key: K,
		value: MediaUserPreferencesTypeMap[K],
	) => void;
	get: <K extends keyof typeof MediaUserPreferencesTypes>(
		key: K,
	) => MediaUserPreferencesTypeMap[K] | undefined;
}

/** Receives a generic UserPreferences interface and converts it to a strongly typed MediaUserPreferences interface */
export const generateMediaUserPreferences = (
	userPreferences: UserPreferences,
): MediaUserPreferences => ({
	set: <K extends keyof typeof MediaUserPreferencesTypes>(
		key: K,
		value: MediaUserPreferencesTypeMap[K],
	) => {
		userPreferences.set(key, value.toString());
	},
	get: <K extends keyof typeof MediaUserPreferencesTypes>(key: K) => {
		const value = userPreferences.get(key);
		if (value === null || value === undefined) {
			return undefined;
		}

		if (MediaUserPreferencesTypes[key] === 'boolean') {
			return (value === 'true') as MediaUserPreferencesTypeMap[K];
		}
		// Uncomment to support number
		// if (MediaUserSettingsTypes[key] === 'number') {
		// 	return Number(value) as MediaSettingsTypeMap[K];
		// }
		return value as MediaUserPreferencesTypeMap[K];
	},
});

const defaultUserPreferences: UserPreferences = {
	set: (key: string, value: string) => {
		const MEDIA_KEY = 'media';
		localStorage.setItem(`${MEDIA_KEY}-${key}`, value);
	},
	get: (key: string) => {
		const MEDIA_KEY = 'media';
		return localStorage.getItem(`${MEDIA_KEY}-${key}`);
	},
};

export const defaultMediaUserPreferences: MediaUserPreferences =
	generateMediaUserPreferences(defaultUserPreferences);
