import { StorageClient } from '@atlaskit/frontend-utilities/storage-client';

import { DEFAULT_LANGUAGES, getLanguageIdentifier } from '../pm-plugins/language-list';

import {
	DETECT_LANGUAGE_VALUE,
	NONE_LANGUAGE_VALUE,
	PLAIN_TEXT_LANGUAGE_VALUE,
} from './language-picker-options';

export const RECENT_LANGUAGES_STORAGE_KEY = 'recently-used-languages';
const RECENT_LANGUAGES_STORAGE_CLIENT_KEY = '@atlaskit/editor-plugin-code-block';
const MAX_RECENT_LANGUAGES = 3;

const RECENT_LANGUAGE_BLOCKLIST = new Set([
	DETECT_LANGUAGE_VALUE,
	NONE_LANGUAGE_VALUE,
	PLAIN_TEXT_LANGUAGE_VALUE,
]);

const KNOWN_LANGUAGE_VALUES = new Set(
	DEFAULT_LANGUAGES.map((language) => getLanguageIdentifier(language)),
);

const recentLanguagesStorageClient = new StorageClient(RECENT_LANGUAGES_STORAGE_CLIENT_KEY);

const isValidRecentLanguage = (language: string): boolean =>
	KNOWN_LANGUAGE_VALUES.has(language) && !RECENT_LANGUAGE_BLOCKLIST.has(language);

const readRecentLanguages = (): string[] => {
	const storedValue = recentLanguagesStorageClient.getItem(RECENT_LANGUAGES_STORAGE_KEY);

	return Array.isArray(storedValue) ? storedValue : [];
};

export const getRecentLanguages = (): string[] => {
	try {
		return readRecentLanguages();
	} catch {
		return [];
	}
};

export const saveRecentLanguage = (language: string): void => {
	if (!isValidRecentLanguage(language)) {
		return;
	}

	try {
		const recentLanguages = readRecentLanguages();
		const nextRecentLanguages = Array.from(new Set([language, ...recentLanguages])).slice(
			0,
			MAX_RECENT_LANGUAGES,
		);

		// StorageClient only exposes setItemWithExpiry; omitting the duration stores without expiry.
		recentLanguagesStorageClient.setItemWithExpiry(
			RECENT_LANGUAGES_STORAGE_KEY,
			nextRecentLanguages,
		);
	} catch {
		return;
	}
};

export const clearRecentLanguages = (): void => {
	recentLanguagesStorageClient.removeItem(RECENT_LANGUAGES_STORAGE_KEY);
};
