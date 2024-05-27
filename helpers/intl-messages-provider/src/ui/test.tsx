import React from 'react';

import { render, screen } from '@testing-library/react';
import { defineMessages, IntlProvider, useIntl } from 'react-intl-next';

import { default as IntlMessagesProvider } from './main';
import { type I18NMessages } from './types';

describe('IntlMessagesProvider', () => {
  const messages = defineMessages({
    foo: {
      id: 'foo',
      defaultMessage: 'Default string',
      description: 'An arbitrary string used in tests',
    },
    bar: {
      id: 'bar',
      defaultMessage: 'Another string',
      description: 'A second arbitrary string used in tests',
    },
  });

  const original = { foo: 'Default string' };
  const translated = { foo: 'Translated string' };

  type SetupProps = {
    locale: string;
    loaderFn: (locale: string) => Promise<I18NMessages | undefined>;
    children?: React.ReactNode;
    defaultMessages?: I18NMessages;
    parentMessages?: I18NMessages;
  };

  const setup = ({
    locale,
    children,
    loaderFn,
    defaultMessages,
    parentMessages,
  }: SetupProps) => {
    return render(
      <IntlProvider
        locale={locale}
        messages={parentMessages ?? { bar: 'Another string' }}
      >
        <IntlMessagesProvider
          loaderFn={loaderFn}
          defaultMessages={defaultMessages}
        >
          {children}
        </IntlMessagesProvider>
      </IntlProvider>,
    );
  };

  const Component = () => {
    const intl = useIntl();
    return (
      <>
        <div>{intl.formatMessage(messages.foo)}</div>
        <div>{intl.formatMessage(messages.bar)}</div>
      </>
    );
  };

  const props: SetupProps = {
    locale: 'es',
    defaultMessages: original,
    loaderFn: jest.fn().mockImplementation(() => Promise.resolve(translated)),
    children: <Component />,
  };

  beforeEach(() => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    consoleErrorSpy.mockImplementation(jest.fn);
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Should display translated messages after loaded', async () => {
    setup(props);

    expect(screen.queryByText(original.foo)).toBeInTheDocument();
    expect(await screen.findByText(translated.foo)).toBeInTheDocument();
  });

  it('Should display translated messages from upstream IntlProviders', async () => {
    setup(props);

    expect(
      await screen.findByText(messages.bar.defaultMessage),
    ).toBeInTheDocument();
  });

  it('Should prefer to use inherited messages from parent provider instead of `defaultMessages`', async () => {
    setup({
      ...props,
      loaderFn: async () =>
        new Promise(res =>
          setTimeout(() => {
            res({
              bar: 'BAR LOADED MESSAGE',
            });
          }),
        ),
      defaultMessages: {
        bar: 'BAR DEFAULT MESSAGE',
      },
      parentMessages: {
        bar: 'BAR PARENT PROVIDED MESSAGE',
      },
    });

    /**
     * Syncronously prefers the parent message, not the default message
     */
    expect(
      screen.queryByText('BAR PARENT PROVIDED MESSAGE'),
    ).toBeInTheDocument();
    expect(screen.queryByText('BAR DEFAULT MESSAGE')).not.toBeInTheDocument();

    /**
     * Loads in the translated message async
     */
    expect(await screen.findByText('BAR LOADED MESSAGE')).toBeInTheDocument();
    expect(
      screen.queryByText('BAR PARENT PROVIDED MESSAGE'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('BAR DEFAULT MESSAGE')).not.toBeInTheDocument();
  });
});
