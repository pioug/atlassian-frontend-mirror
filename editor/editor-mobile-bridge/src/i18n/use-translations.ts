import { useState, useEffect } from 'react';
import { addLocaleData } from 'react-intl';
import { getLocaleValue } from '../query-param-reader';

export type Messages = Object | undefined;

const supportedLocaleWithRegions = ['en_GB', 'pt_BR', 'pt_PT'];

export const useTranslations = (
  geti18NMessages?: (localeFileName: string) => Promise<Object>,
): [string, Messages] => {
  const [locale, setLocale] = useState(getLocaleValue());
  const [messages, setMessages] = useState<Messages>();

  useEffect(() => {
    (async () => {
      try {
        let localeFileName = locale.substring(0, 2);
        const localeData = await import(
          `react-intl/locale-data/${localeFileName}`
        );
        addLocaleData(localeData.default);

        if (supportedLocaleWithRegions.includes(locale)) {
          localeFileName = locale;
        }
        if (geti18NMessages) {
          const messages: Object = await geti18NMessages(localeFileName);
          setMessages(messages);
          // eslint-disable-next-line no-console
          console.info(`Translations loaded successfuly for locale: ${locale}`);
        } else {
          setMessages({});
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Could not load translations for locale: ${locale}`, e);
        // eslint-disable-next-line no-console
        console.info('fallback locale to english');
        setLocale('en');
        setMessages({});
      }
    })();
  }, [locale, geti18NMessages]);

  return [locale, messages];
};
