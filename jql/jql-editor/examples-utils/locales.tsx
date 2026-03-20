import * as i18nMessages from '../src/i18n';

type LocaleMessages = Record<string, string>;

export const locales: Record<string, LocaleMessages> = {
	...(i18nMessages as Record<string, LocaleMessages>),
	// Append the 'en' locale, so it is selectable in our picker
	en: {},
};

export type Locale = keyof typeof locales & string;
