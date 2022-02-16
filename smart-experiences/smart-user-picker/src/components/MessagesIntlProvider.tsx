import React, { useMemo } from 'react';
import { IntlProvider, injectIntl, IntlShape } from 'react-intl-next';
import { getMessagesForLocale } from '../util/i18n-util';

export interface MessagesIntlProviderProps {
  intl: IntlShape;
}

const EMPTY: Record<string, string> = {};

const useI18n = (locale: string): Record<string, string> => {
  const [messages, setMessages] = React.useState<Record<string, string>>(EMPTY);

  React.useEffect(() => {
    let aborted = false;
    setMessages(EMPTY);
    getMessagesForLocale(locale)
      .then((messages) => {
        if (!aborted) {
          setMessages(messages);
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });

    return () => {
      aborted = true;
    };
  }, [locale]);

  return messages;
};

const MessagesIntlProvider: React.FC<MessagesIntlProviderProps> = (props) => {
  const { intl, children } = props;
  const messages = useI18n(intl.locale);
  const mergedMessages = useMemo<Record<string, string>>(() => {
    return {
      ...(intl.messages as Record<string, string>),
      ...messages,
    };
  }, [intl.messages, messages]);

  return (
    <IntlProvider locale={intl.locale} messages={mergedMessages}>
      {children}
    </IntlProvider>
  );
};

export default injectIntl(MessagesIntlProvider);
