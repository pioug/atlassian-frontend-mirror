import React from 'react';

import { IntlProvider, useIntl } from 'react-intl-next';

import { useMessages } from './utils/use-messages';

type LazyMessagesProviderProps = {
  children?: React.ReactNode;
};

export const LazyMessagesProvider = (props: LazyMessagesProviderProps) => {
  const intl = useIntl();
  const messages = useMessages(intl.locale);

  return (
    <IntlProvider
      {...props}
      defaultLocale="en"
      messages={messages}
      locale={intl.locale}
    />
  );
};
