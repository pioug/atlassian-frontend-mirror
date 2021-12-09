import React, { useMemo } from 'react';

import {
  injectIntl,
  IntlProvider,
  MessageFormatElement,
  WrappedComponentProps,
} from 'react-intl-next';

import { getMessagesForLocale, LangCode } from '../util/i18n-util';

export interface Props {
  children: React.ReactChild;
}

const MessagesIntlProvider = ({
  intl,
  children,
}: Props & WrappedComponentProps) => {
  const mergedMessages = useMemo(() => {
    return {
      ...intl.messages,
      ...getMessagesForLocale(intl.locale as LangCode),
    } as Record<string, string> | Record<string, MessageFormatElement[]>;
  }, [intl.messages, intl.locale]);
  return (
    <IntlProvider locale={intl.locale} messages={mergedMessages}>
      {children}
    </IntlProvider>
  );
};

export default injectIntl(MessagesIntlProvider);
