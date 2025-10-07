import { useEffect, useState } from 'react';

import { DEFAULT_LOCALE_STATE } from '../../common/constants';
import { type I18NMessages } from '../../index';

export type LocaleState = {
	locale: string;
	messages: I18NMessages | undefined;
};

export const useMessages = (
	locale: string,
	loaderFn: (locale: string) => Promise<I18NMessages | undefined>,
): I18NMessages | undefined => {
	const [localeState, setLocaleState] = useState<LocaleState>(DEFAULT_LOCALE_STATE);

	useEffect(() => {
		if (!localeState.messages || locale !== localeState.locale) {
			let current = true;

			loaderFn(locale).then((messages) => {
				if (current) {
					setLocaleState({
						locale,
						messages: messages ?? {},
					});
				}
			});

			return () => {
				current = false;
			};
		}

		return undefined;
	}, [loaderFn, locale, localeState]);

	return localeState.messages;
};
