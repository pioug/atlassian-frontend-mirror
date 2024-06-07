import React, { type ReactNode, useCallback, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import { LocalePicker } from './locale-picker';
import { type Locale, locales } from './locales';

type Props = {
	children: ReactNode;
};

export const LocaleProvider = ({ children }: Props) => {
	const [locale, setLocale] = useState('en');
	const [messages, setMessages] = useState<{ [key: string]: string }>({});

	const onLocaleChange = useCallback(
		(locale: Locale) => {
			setMessages(locales[locale]);
			setLocale(locale);
		},
		[setLocale, setMessages],
	);

	const formattedLocale = locale.replace('_', '-');

	return (
		<IntlProvider locale={formattedLocale} key={formattedLocale} messages={messages}>
			<LocalePicker
				currentLocale={locale}
				locales={Object.keys(locales).sort() as Locale[]}
				onChange={onLocaleChange}
			/>
			{children}
		</IntlProvider>
	);
};
