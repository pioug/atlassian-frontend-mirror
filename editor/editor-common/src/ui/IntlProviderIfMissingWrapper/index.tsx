import React, { useContext } from 'react';

import { IntlContext, IntlProvider } from 'react-intl-next';

interface WrapProps {
  children: JSX.Element;
}

const useCheckIntlContext = () => useContext(IntlContext) === null;

export default function IntlProviderIfMissingWrapper({ children }: WrapProps) {
  const missingIntlContext = useCheckIntlContext();

  if (missingIntlContext) {
    return <IntlProvider locale="en">{children}</IntlProvider>;
  }
  return children;
}
