import React, { useMemo } from 'react';

import { IntlProvider, useIntl } from 'react-intl-next';

import { useMessages } from '../services/use-messages';

import { IntlMessagesProviderProps } from './types';

export default function IntlMessagesProvider({
  loaderFn,
  children,
  defaultMessages,
}: IntlMessagesProviderProps) {
  const intl = useIntl();
  const messages = useMessages(intl.locale, loaderFn);

  /**
   * IntlProvider does not inherit from upstream IntlProviders,
   * we lookup messages in the context and pass them downstream
   * This prevents the missing messages error
   */
  const mergedMessages = useMemo(() => {
    return { ...defaultMessages, ...intl.messages, ...messages };
  }, [intl, messages, defaultMessages]);

  return (
    <IntlProvider
      defaultLocale="en"
      locale={intl.locale}
      onError={intl.onError}
      messages={mergedMessages}
    >
      {children}
    </IntlProvider>
  );
}
