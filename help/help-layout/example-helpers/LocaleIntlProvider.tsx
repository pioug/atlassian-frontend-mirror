import React from 'react';
import { IntlProvider } from 'react-intl-next';
import MessagesIntlProvider from '../src/components/MessagesIntlProvider';

const LocaleIntlProvider = ({
	locale = 'en',
	children,
}: {
	children: React.ReactNode;
	locale?: string;
}) => (
	<IntlProvider key={locale} locale={locale}>
		{children}
	</IntlProvider>
);

const LocaleAndMessagesIntlProvider = ({
	locale = 'en',
	children,
}: {
	children: any;
	locale?: string;
}) => (
	<LocaleIntlProvider key={locale} locale={locale}>
		<MessagesIntlProvider locale={locale}>{children}</MessagesIntlProvider>
	</LocaleIntlProvider>
);

export default LocaleIntlProvider;
export { LocaleAndMessagesIntlProvider };
