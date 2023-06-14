import { useEffect, useState } from 'react';

import messages from '../../../../i18n/en';

import { fetchMessagesForLocale } from './fetch-messages-for-locale';
import { I18NMessages } from './types';

/**
 * Hook to load the messages for a given locale
 * English is sync/pre-loaded
 */
export const useMessages = (locale: string) => {
  const [localeState, setLocaleState] = useState<{
    locale: string;
    messages: I18NMessages | undefined;
  }>({
    locale: 'en',
    messages,
  });

  useEffect(() => {
    if (locale !== localeState.locale) {
      let current = true;

      fetchMessagesForLocale(locale).then(messages => {
        if (current) {
          setLocaleState({
            messages,
            locale,
          });
        }
      });

      return () => {
        current = false;
      };
    }
  }, [localeState, locale]);

  return localeState.messages;
};
