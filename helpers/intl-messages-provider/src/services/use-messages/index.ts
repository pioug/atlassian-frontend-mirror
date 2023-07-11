import { useEffect, useState } from 'react';

import { I18NMessages } from '../../index';

export type LocaleState = {
  locale: string;
  messages: I18NMessages | undefined;
};

export const useMessages = (
  locale: string,
  loaderFn: (locale: string) => Promise<I18NMessages | undefined>,
  defaultMessages?: I18NMessages,
): I18NMessages | undefined => {
  const [localeState, setLocaleState] = useState<LocaleState>({
    locale: 'en',
    messages: defaultMessages,
  });

  useEffect(() => {
    if (!localeState.messages || locale !== localeState.locale) {
      let current = true;

      loaderFn(locale).then(messages => {
        if (current) {
          setLocaleState({
            locale,
            messages,
          });
        }
      });

      return () => {
        current = false;
      };
    }
  }, [loaderFn, locale, localeState]);

  return localeState.messages;
};
