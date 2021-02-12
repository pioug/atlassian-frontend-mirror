import React from 'react';

import { addLocaleData, IntlProvider } from 'react-intl';
import * as en from 'react-intl/locale-data/en';

addLocaleData(en);

type Props = {
  locale?: string;
  children: React.ReactNode;
};

const LocaleIntlProvider = (props: Props) => {
  const { locale = 'en', children } = props;

  return (
    <IntlProvider key={locale} locale={locale}>
      {children}
    </IntlProvider>
  );
};

export default LocaleIntlProvider;
