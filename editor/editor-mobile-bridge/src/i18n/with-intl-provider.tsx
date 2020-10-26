import React from 'react';
import { IntlProvider } from 'react-intl';
import { useTranslations } from './use-translations';

const IntlProviderWrapper: React.FC = props => {
  const [locale, messages] = useTranslations();

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
): React.FC<Omit<T, 'intl'>> {
  return props => {
    return (
      <IntlProviderWrapper>
        <WrappedComponent {...(props as T)} />
      </IntlProviderWrapper>
    );
  };
}
