import { type I18NMessages } from '@atlaskit/intl-messages-provider';

import messages from '../../i18n/en';

const localeMap: Record<string, string> = {
	pt: 'pt-BR',
	'pt-PT': 'pt-BR',
	'en-AU': 'en-GB',
};

export const fetchMessagesForLocale = async (locale: string): Promise<I18NMessages | undefined> => {
	try {
		const targetLocale = (localeMap[locale] ?? locale ?? '').replace('-', '_');

		if (!targetLocale) {
			throw new Error('No mapped locale');
		}

		const messages = await import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/team-central-i18n-[request]" */ `../../i18n/${targetLocale}`
		);

		return messages.default;
	} catch (e) {
		// ignore
	}

	try {
		const parentLocale = locale.split(/[-_]/)[0];
		const messages = await import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/team-central-i18n-[request]" */ `../../i18n/${parentLocale}`
		);

		return messages.default;
	} catch (e) {
		// ignore
	}

	/**
	 * English bundled by default as this is the majority of users
	 */
	return messages;
};
