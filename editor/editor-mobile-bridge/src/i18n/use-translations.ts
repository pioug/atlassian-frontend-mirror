import { useState, useEffect } from 'react';
import { addLocaleData } from 'react-intl';

export type Messages = Object | undefined;

const supportedLocaleWithRegions = ['en_GB', 'pt_BR', 'pt_PT'];

interface TranslationState {
  locale: string;
  messages: Messages;
}

export const useTranslations = (
  locale: string,
  geti18NMessages?: (localeFileName: string) => Promise<Object>,
  onLocaleChanged?: () => void,
  onWillLocaleChange?: () => void,
): TranslationState => {
  const [translationState, setTranslationState] = useState<TranslationState>({
    locale,
    messages: undefined,
  });

  useEffect(() => {
    (async () => {
      if (onWillLocaleChange) {
        onWillLocaleChange();
      }

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
          setTranslationState({
            locale,
            messages,
          });
          // eslint-disable-next-line no-console
          console.info(`Translations loaded successfuly for locale: ${locale}`);
        } else {
          setTranslationState({
            locale,
            messages: {},
          });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Could not load translations for locale: ${locale}`, e);
        // eslint-disable-next-line no-console
        console.info('fallback locale to english');
        setTranslationState({
          locale: 'en',
          messages: {},
        });
      }

      if (onLocaleChanged) {
        onLocaleChanged();
      }
    })();
  }, [locale, geti18NMessages, onWillLocaleChange, onLocaleChanged]);

  return translationState;
};
