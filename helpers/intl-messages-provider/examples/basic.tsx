import React, { useCallback } from 'react';

import { defineMessages, IntlProvider, useIntl } from 'react-intl-next';

import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';

const messages = defineMessages({
  foo: {
    id: 'foo',
    defaultMessage: 'Default string',
    description: 'An arbitrary string used in tests',
  },
});

const translated = { foo: 'Translated string' };

const Component = () => {
  const intl = useIntl();
  return <div>{intl.formatMessage(messages.foo)}</div>;
};

function Basic() {
  const fetchMessages = useCallback(async (locale: string) => {
    // Arbitrary import of language->locale messages ;
    const i18n = Promise.resolve(translated);
    return i18n;
  }, []);

  return (
    <IntlMessagesProvider loaderFn={fetchMessages}>
      <Component />
    </IntlMessagesProvider>
  );
}

export default function Example() {
  return (
    <IntlProvider locale="en">
      <Basic />
    </IntlProvider>
  );
}
