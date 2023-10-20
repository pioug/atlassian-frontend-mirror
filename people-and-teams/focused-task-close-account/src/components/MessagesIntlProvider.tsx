import React from 'react';
import {
  IntlProvider,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl-next';
import { getMessagesForLocale, LangCode } from '../util/i18n-util';

export interface Props {
  children: React.ReactChild;
}

class MessagesIntlProvider extends React.Component<
  Props & WrappedComponentProps
> {
  render() {
    const { intl, children } = this.props;

    return (
      <IntlProvider
        messages={getMessagesForLocale(intl.locale as LangCode)}
        locale={intl.locale}
        defaultLocale="en-US"
      >
        {children}
      </IntlProvider>
    );
  }
}

export default injectIntl(MessagesIntlProvider);
