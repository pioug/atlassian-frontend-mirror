import React, { ReactNode, useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import { SmartCardProvider } from '@atlaskit/link-provider';

import { ufologger } from '@atlaskit/ufo';
import { LanguagePicker } from './LanguagePicker';
import languages from '../src/i18n/languages';
import enMessages from '../src/i18n/en';
import { getTranslations } from './get-translations';

interface WrapperProps {
  children: ReactNode;
  isLanguagePickerVisible?: boolean;
}

export type messages = { [key: string]: string };

export function PageWrapper({
  children,
  isLanguagePickerVisible = false,
}: WrapperProps) {
  ufologger.enable();
  const [locale, setLocale] = useState('en');
  const [messages, setMessages] = useState<messages>(enMessages);

  const getProperLanguageKey = (locale: string) => locale.replace('_', '-');

  const loadLocale = async (locale: string) => {
    await getTranslations(locale).then(setMessages);
    setLocale(getProperLanguageKey(locale));
  };

  const languagePicker = isLanguagePickerVisible && (
    <LanguagePicker
      locale={locale}
      languages={languages}
      onChange={loadLocale}
    />
  );

  return (
    <SmartCardProvider
      featureFlags={{
        useLinkPickerScrollingTabs: true,
        useLinkPickerAtlassianTabs: true,
      }}
    >
      <div className="example" style={{ padding: 50 }}>
        {languagePicker}
        <IntlProvider locale={locale} messages={messages}>
          {children}
        </IntlProvider>
      </div>
    </SmartCardProvider>
  );
}

export function PageHeader(wrapperProps: WrapperProps) {
  return (
    <div style={{ marginBottom: '2em', maxWidth: 700 }}>
      {wrapperProps.children}
    </div>
  );
}
