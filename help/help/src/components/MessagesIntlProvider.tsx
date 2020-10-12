import React from 'react';
import { IntlProvider, injectIntl, InjectedIntlProps } from 'react-intl';
import { getMessagesForLocale, LangCode } from '../util/i18n-util';

export interface Props {
  children: React.ReactChild;
}

export const MessagesIntlProvider: React.FC<Props & InjectedIntlProps> = ({
  intl,
  children,
}) => (
  <IntlProvider messages={getMessagesForLocale(intl.locale as LangCode)}>
    {children}
  </IntlProvider>
);

export default injectIntl(MessagesIntlProvider);
