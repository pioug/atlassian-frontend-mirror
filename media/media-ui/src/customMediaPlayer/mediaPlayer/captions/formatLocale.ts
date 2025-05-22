export const formatLocale = (baseLocale: string, locale: string): string => {
	try {
		const formatted = new Intl.DisplayNames(baseLocale, {
			type: 'language',
			languageDisplay: 'standard',
		}).of(locale);
		return formatted ?? locale;
	} catch (error) {
		return locale;
	}
};
