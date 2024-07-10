import { type I18NMessages } from '@atlaskit/intl-messages-provider';

import { locales } from '../../../../i18n';

export const fetchMessagesForLocale = async (locale: string): Promise<I18NMessages | undefined> => {
	try {
		const localeKey = locale.replace('-', '_');
		if (localeKey in locales) {
			const messages = await locales[localeKey]();
			return messages.default;
		}
	} catch (e) {
		// ignore
	}

	try {
		const parentLocale = locale.split(/[-_]/)[0];
		if (parentLocale in locales) {
			const messages = await locales[parentLocale]();
			return messages.default;
		}
	} catch (e) {
		// ignore
	}
};
