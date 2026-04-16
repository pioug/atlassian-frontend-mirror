import { useEffect, useState, useRef } from 'react';

import { functionWithFG } from '@atlaskit/platform-feature-flags-react';

import { DEFAULT_LOCALE_STATE, NEW_DEFAULT_LOCALE_STATE } from '../../common/constants';
import { type I18NMessages } from '../../index';

export type LocaleState = {
	locale: string;
	messages: I18NMessages | undefined;
};

export const useMessages: (
	locale: string,
	loaderFn: (locale: string) => Promise<I18NMessages | undefined>,
) => I18NMessages | undefined = functionWithFG(
	'navx-4615-fix-async-intl-for-gsn',
	useMessagesNEW,
	useMessagesOLD,
);

function useMessagesNEW(
	locale: string,
	loaderFn: (locale: string) => Promise<I18NMessages | undefined>,
): I18NMessages | undefined {
	const [localeState, setLocaleState] = useState<LocaleState>(NEW_DEFAULT_LOCALE_STATE);
	const loadedLocaleRef = useRef(localeState.locale);

	useEffect(() => {
		// Skip if we already have messages for this locale
		if (locale === loadedLocaleRef.current) {
			return;
		}

		let current = true;

		loaderFn(locale).then(
			(messages) => {
				if (current) {
					loadedLocaleRef.current = locale;
					setLocaleState({ locale, messages: messages ?? {} });
				}
			},
			(error) => {
				// Handle or log error appropriately
				console.error('Failed to load i18n messages via intl-messages-provider', error);
			},
		);

		return () => {
			current = false;
		};
	}, [loaderFn, locale]);

	return localeState.messages;
}

function useMessagesOLD(
	locale: string,
	loaderFn: (locale: string) => Promise<I18NMessages | undefined>,
): I18NMessages | undefined {
	const [localeState, setLocaleState] = useState<LocaleState>(DEFAULT_LOCALE_STATE);

	useEffect(() => {
		if (!localeState.messages || locale !== localeState.locale) {
			let current = true;

			loaderFn(locale).then((messages) => {
				if (current) {
					setLocaleState({ locale, messages: messages ?? {} });
				}
			});

			return () => {
				current = false;
			};
		}

		return undefined;
	}, [loaderFn, locale, localeState]);

	return localeState.messages;
}
