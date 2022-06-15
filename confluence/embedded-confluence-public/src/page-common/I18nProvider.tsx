import React from 'react';

import { IntlProvider as IntlNextProvider } from 'react-intl-next';

/* eslint-disable-next-line import/no-extraneous-dependencies */
import {
  IntlNextErrorBoundary,
  useLocale,
} from '@atlassian/embedded-confluence-common';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as untypedI18n from '@atlassian/embedded-confluence-common/i18n';

const DEFAULT_LOCALE = 'en-US';

const i18n: {
  [index: string]: Record<string, string> | undefined;
} = untypedI18n;

const I18nProviderInner: React.FC = ({ children }) => {
  const { language, locale, region } = useLocale();

  const messages = i18n[`${language}_${region}`] || i18n[language];

  return (
    <IntlNextProvider
      locale={locale}
      messages={messages}
      defaultLocale={DEFAULT_LOCALE}
    >
      {children}
    </IntlNextProvider>
  );
};

export const I18nProvider: React.FC = ({ children }) => {
  return (
    <IntlNextErrorBoundary>
      <I18nProviderInner>{children}</I18nProviderInner>
    </IntlNextErrorBoundary>
  );
};
