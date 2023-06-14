import React from 'react';

import { act, render, screen } from '@testing-library/react';
import { defineMessages, IntlProvider, useIntl } from 'react-intl-next';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { ManualPromise } from '@atlaskit/link-test-helpers';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { fetchMessagesForLocale } from './lazy-messages-provider/utils/fetch-messages-for-locale';

jest.mock('./lazy-messages-provider/utils/fetch-messages-for-locale', () => ({
  fetchMessagesForLocale: jest.fn(() => ({})),
}));

describe('MessagesProvider', () => {
  let MessagesProvider: React.ComponentType;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.isolateModules(() => {
      MessagesProvider = require('./index').MessagesProvider;
    });
  });

  type SetupProps = { locale: string; children?: React.ReactNode };

  const setup = (
    { locale, children }: SetupProps = {
      locale: 'en',
    },
  ) => {
    return render(
      <IntlProvider defaultLocale="en" locale={locale}>
        <MessagesProvider>{children}</MessagesProvider>
      </IntlProvider>,
    );
  };

  const messages = defineMessages({
    foo: {
      id: 'foo',
      defaultMessage: 'Default string',
      description: 'An arbitrary string used in tests',
    },
  });

  const Component = () => {
    const intl = useIntl();
    return <div>{intl.formatMessage(messages.foo)}</div>;
  };

  const translated = { foo: 'Translated string' };

  const props = {
    locale: 'es',
    children: (
      <div>
        <Component />
      </div>
    ),
  };

  ffTest(
    'platform.linking-platform.link-picker.lazy-intl-messages',
    async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const promise = new ManualPromise(translated);
      asMock(fetchMessagesForLocale).mockReturnValue(promise);

      setup(props);

      expect(screen.queryByText('Translated string')).not.toBeInTheDocument();

      act(() => {
        promise.resolve(translated);
      });

      expect(await screen.findByText('Translated string')).toBeInTheDocument();
    },
    async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const promise = new ManualPromise(translated);
      asMock(fetchMessagesForLocale).mockReturnValue(promise);

      setup(props);

      expect(fetchMessagesForLocale).not.toHaveBeenCalled();
      expect(screen.getByText('Default string')).toBeInTheDocument();
    },
  );
});
