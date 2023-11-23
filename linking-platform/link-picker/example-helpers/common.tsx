import React, { ReactNode, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { ufologger } from '@atlaskit/ufo';

import languages from '../src/i18n/languages';

import { LanguagePicker } from './LanguagePicker';

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

  const getProperLanguageKey = (locale: string) => locale.replace('_', '-');

  const languagePicker = isLanguagePickerVisible && (
    <LanguagePicker
      locale={locale}
      languages={languages}
      onChange={locale => setLocale(getProperLanguageKey(locale))}
    />
  );

  return (
    <SmartCardProvider>
      <div className="example" style={{ padding: 50 }}>
        {languagePicker}
        <IntlProvider locale={locale}>{children}</IntlProvider>
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
