import React from 'react';
import { IntlProvider, injectIntl, InjectedIntlProps } from 'react-intl';
import { getMessagesForLocale, LangCode } from '../util/i18n-util';

export interface Props {
  children: React.ReactChild;
}

class MessagesIntlProvider extends React.Component<Props & InjectedIntlProps> {
  render() {
    const { intl, children } = this.props;

    return (
      <IntlProvider messages={getMessagesForLocale(intl.locale as LangCode)}>
        {children}
      </IntlProvider>
    );
  }
}

export default injectIntl(MessagesIntlProvider);
