import React from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import MessagesIntlProvider from '../src/components/MessagesIntlProvider';

import * as fr from 'react-intl/locale-data/fr';
import * as es from 'react-intl/locale-data/es';
import * as pt from 'react-intl/locale-data/pt';
import * as zh from 'react-intl/locale-data/zh';
addLocaleData([...fr, ...es, ...pt, ...zh]);

const LocaleIntlProvider = ({
  locale = 'en',
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) => (
  <IntlProvider key={locale} locale={locale}>
    {children}
  </IntlProvider>
);

const LocaleAndMessagesIntlProvider = ({
  locale = 'en',
  children,
}: {
  locale: string;
  children: any;
}) => (
  <LocaleIntlProvider key={locale} locale={locale}>
    <MessagesIntlProvider>{children}</MessagesIntlProvider>
  </LocaleIntlProvider>
);

export default LocaleIntlProvider;
export { LocaleAndMessagesIntlProvider };
