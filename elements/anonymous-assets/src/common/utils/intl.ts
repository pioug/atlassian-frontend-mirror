import { createIntl, createIntlCache, type IntlShape } from 'react-intl-next';

import { getDocument } from '@atlaskit/browser-apis';

import { locales } from '../../i18n';
import enMessages from '../../i18n/en';

const localeMap: Record<string, string> = {
	pt: 'pt-BR',
	'pt-PT': 'pt-BR',
	'en-AU': 'en-GB',
};

const intlCacheMap = new Map<string, IntlShape>();

export const getIntl = async () => {
	const key = getDocument()?.documentElement?.lang || 'en-US';

	if (!intlCacheMap.has(key)) {
		const messages = await fetchMessages(key);
		const cache = createIntlCache();
		const intl = createIntl({ locale: key, messages }, cache);
		intlCacheMap.set(key, intl);
	}

	return intlCacheMap.get(key)!;
};

const fetchMessages = async (locale: string): Promise<{ [key: string]: string }> => {
	try {
		const targetLocale = (localeMap[locale] ?? locale ?? '').replace('-', '_');

		if (targetLocale in locales) {
			const messages = await locales[targetLocale]();
			return messages.default;
		}

		const parentLocale = locale.split(/[-_]/)[0];
		if (parentLocale in locales) {
			const messages = await locales[parentLocale]();
			return messages.default;
		}
	} catch (e) {
		// ignore
	}

	/**
	 * English bundled by default as this is the majority of users
	 */
	return enMessages;
};
