import { useState, useEffect } from 'react';
import { addLocaleData } from 'react-intl';
import { getLocaleValue } from '../../query-param-reader';

export type Messages = Object | undefined;

const supportedLocaleWithRegions = ['en_GB', 'pt_BR', 'pt_PT'];

export default (): [string, Messages] => {
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

        const messages: Object = await Promise.all([
          import(`@atlaskit/editor-core/src/i18n/${localeFileName}`),
          import(`@atlaskit/mention/src/i18n/${localeFileName}`),
        ]).then(args => ({
          ...args[0].default,
          ...args[1].default,
        }));

        setMessages(messages);
        // eslint-disable-next-line no-console
        console.info(`Translations loaded successfuly for locale: ${locale}`);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Could not load translations for locale: ${locale}`, e);
        // eslint-disable-next-line no-console
        console.info('fallback locale to english');
        setLocale('en');
      }
    })();
  }, [locale]);

  return [locale, messages];
};
