import React from 'react';
import { IntlProvider, injectIntl, InjectedIntl } from 'react-intl';
import { getMessagesForLocale } from '../util/i18n-util';

export interface MessagesIntlProviderProps {
  intl: InjectedIntl;
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

  return <IntlProvider messages={messages}>{children}</IntlProvider>;
};

export default injectIntl(MessagesIntlProvider);
