import React from 'react';
import { IntlProvider } from 'react-intl';
import { useTranslations } from './use-translations';

type geti18NMessagesType = (localeFileName: string) => Promise<Object>;
interface Props {
  children?: React.ReactNode;
  geti18NMessages: geti18NMessagesType;
}
const IntlProviderWrapper: React.FC<Props> = props => {
  const [locale, messages] = useTranslations(props.geti18NMessages);

  if (!messages) {
    return null;
  }

  return (
    <IntlProvider locale={locale.replace('_', '-')} messages={messages}>
      {props.children}
    </IntlProvider>
  );
};

export function withIntlProvider<T>(
  WrappedComponent: React.ComponentType<T>,
  geti18NMessages: geti18NMessagesType,
): React.FC<Omit<T, 'intl'>> {
  return props => {
    return (
      <IntlProviderWrapper geti18NMessages={geti18NMessages}>
        <WrappedComponent {...(props as T)} />
      </IntlProviderWrapper>
    );
  };
}
