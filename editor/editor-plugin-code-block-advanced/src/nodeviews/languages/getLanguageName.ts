import { SUPPORTED_LANGUAGES } from '@atlaskit/code/constants';

// We expect alias[0] to be used for the ADF attribute, see ED-2813
export const DEFAULT_LANGUAGES = [
	{ name: '(None)', alias: ['none'], value: 'none' },
	...SUPPORTED_LANGUAGES,
];

export type Language = (typeof DEFAULT_LANGUAGES)[number];

const getLanguageName = (languageValue: string): string | undefined => {
	if (!languageValue) {
		return undefined;
	}

	const language = (SUPPORTED_LANGUAGES as readonly Language[]).find((l) => {
		return l.value === languageValue || (l.alias && (l.alias as string[]).includes(languageValue));
	});

	return language ? language.name : undefined;
};

export default getLanguageName;
