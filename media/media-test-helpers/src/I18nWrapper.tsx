import React, { useState, useEffect } from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import LocaleSelect, {
  Locale,
  defaultLocales,
} from '@atlaskit/locale/LocaleSelect';
import { locales } from '@atlaskit/media-ui/locales';

function getMessages(localeValue: string) {
  const lang = localeValue.substring(0, 2);
  const langWithRegion = localeValue.replace('-', '_');
  return locales[langWithRegion] || locales[lang];
}

const selectableLocales = defaultLocales.reduce((result, locale) => {
  if (!getMessages(locale.value)) {
    return result;
  }
  return [...result, locale];
}, [] as Locale[]);

function addAllLocaleData() {
  Object.keys(locales).forEach((localeKey) => {
    const lang = localeKey.substring(0, 2);
    const localeData = require(`react-intl/locale-data/${lang}`);
    addLocaleData(localeData);
  });
}

export interface I18NWrapperState {
  locale: Locale;
}

export interface I18NWrapperProps {
  children: React.ReactNode;
}

export const I18NWrapper = ({ children }: I18NWrapperProps) => {
  const [locale, setLocale] = useState({ label: 'en', value: 'en' });

  // We add the locale data only when mount
  useEffect(() => addAllLocaleData(), []);

  const lang = locale.value.substring(0, 2);
  const messages = getMessages(locale.value);
  return (
    <>
      <div style={{ marginBottom: 10, marginTop: 10 }}>
        <LocaleSelect onLocaleChange={setLocale} locales={selectableLocales} />
      </div>
      <IntlProvider
        locale={lang}
        messages={messages}
        // We need to add this key to force a re-render and refresh translations
        // when selected language has changed
        key={locale.value}
      >
        <>{children}</>
      </IntlProvider>
    </>
  );
};
