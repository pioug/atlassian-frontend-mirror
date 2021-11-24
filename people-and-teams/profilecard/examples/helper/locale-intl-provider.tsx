import React from 'react';

import { IntlProvider } from 'react-intl-next';

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
