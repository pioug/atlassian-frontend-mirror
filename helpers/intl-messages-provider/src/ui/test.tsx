import React from 'react';

import { act, render, screen } from '@testing-library/react';
import { defineMessages, IntlProvider, useIntl } from 'react-intl-next';

import { IntlMessagesProvider } from './main';
import { I18NMessages } from './types';

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
  const parentMessages = { bar: 'Another string' };

  type SetupProps = {
    locale: string;
    loaderFn: (locale: string) => Promise<I18NMessages | undefined>;
    children?: React.ReactNode;
    defaultMessages?: I18NMessages;
  };

  const setup = ({
    locale,
    children,
    loaderFn,
    defaultMessages,
  }: SetupProps) => {
    return render(
      <IntlProvider locale={locale} messages={parentMessages}>
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
    jest.clearAllMocks();
  });

  it('Should display translated messages after loaded', async () => {
    setup(props);
    expect(screen.queryByText(original.foo)).toBeInTheDocument();
    act(() => {
      props.loaderFn(props.locale);
    });
    expect(await screen.findByText(translated.foo)).toBeInTheDocument();
  });

  it('Should display translated messages from upstream IntlProviders', async () => {
    setup(props);
    act(() => {
      props.loaderFn(props.locale);
    });
    expect(
      await screen.findByText(messages.bar.defaultMessage),
    ).toBeInTheDocument();
  });
});
