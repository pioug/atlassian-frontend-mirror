export type Locale = {
	value: string;
	label: string;
};
export type LocaleSelectProps = {
	id?: string;
	locales?: Locale[];
	locale?: Locale;
	defaultLocale?: Locale;
	onLocaleChange?: (locale: Locale) => void;
};
