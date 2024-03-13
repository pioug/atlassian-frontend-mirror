import React, { PropsWithChildren } from 'react';

import { IntlProvider as IntlNextProvider, injectIntl } from 'react-intl-next';
import type { WrappedComponentProps } from 'react-intl-next';

/* eslint-disable-next-line import/no-extraneous-dependencies */
import {
  DEFAULT_LOCALE,
  useLocale,
} from '@atlassian/embedded-confluence-common';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as untypedI18n from '@atlassian/embedded-confluence-common/i18n';

const i18n: {
  [index: string]: Record<string, string> | undefined;
} = untypedI18n;

const I18nProviderInner = (
  props: PropsWithChildren<{ locale?: string } & WrappedComponentProps>,
) => {
  const { language, locale, region } = useLocale(props);

  const messages = i18n[`${language}_${region}`] || i18n[language];

  return (
    <IntlNextProvider
      locale={locale}
      messages={messages}
      defaultLocale={DEFAULT_LOCALE}
    >
      {props.children}
    </IntlNextProvider>
  );
};

export const I18nProvider = injectIntl(I18nProviderInner, {
  enforceContext: false,
});
