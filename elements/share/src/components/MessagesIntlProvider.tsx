import React, { useMemo } from 'react';
import { IntlProvider, injectIntl, InjectedIntlProps } from 'react-intl';
import { getMessagesForLocale, LangCode } from '../util/i18n-util';

export interface Props {
  children: React.ReactChild;
}

const MessagesIntlProvider = ({
  intl,
  children,
}: Props & InjectedIntlProps) => {
  const mergedMessages = useMemo(() => {
    return {
      ...intl.messages,
      ...getMessagesForLocale(intl.locale as LangCode),
    };
  }, [intl.messages, intl.locale]);
  return <IntlProvider messages={mergedMessages}>{children}</IntlProvider>;
};

export default injectIntl(MessagesIntlProvider);
