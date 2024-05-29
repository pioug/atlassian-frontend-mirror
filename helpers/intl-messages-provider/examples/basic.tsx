import React, { useCallback } from 'react';

import { defineMessages, IntlProvider, useIntl } from 'react-intl-next';

import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';

const messages = defineMessages({
  foo: {
    id: 'foo',
    defaultMessage: 'Default foo string',
    description: 'An arbitrary string used in tests',
  },
  bar: {
    id: 'bar',
    defaultMessage: 'Default bar string',
    description: 'An arbitrary string used in tests',
  },
});

/**
 * Example of how a product may provide a set of messages by default
 */
const WithInheritedMessages = ({ children }: { children: React.ReactNode }) => {
  const intl = useIntl();

  return (
    <IntlProvider
      locale={intl.locale}
      messages={{ foo: 'Parent foo message', bar: 'Parent bar message' }}
    >
      {children}
    </IntlProvider>
  );
};

const Message = ({ message }: { message: keyof typeof messages }) => {
  const intl = useIntl();
  return <span>{intl.formatMessage(messages[message])}</span>;
};

export default function Example() {
  const fetchMessages = useCallback(async (locale: string) => {
    // Arbitrary import of language->locale messages ;
    return await new Promise<Record<string, string>>(res => {
      setTimeout(() => {
        res({ foo: 'Translated string' });
      }, 2000);
    });
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th></th>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
          <th style={{ width: 300 }}>foo</th>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
          <th style={{ width: 300 }}>bar</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>With inherited messages</td>
          <td>
            <WithInheritedMessages>
              <IntlMessagesProvider
                loaderFn={fetchMessages}
                defaultMessages={{ foo: 'Custom foo default message' }}
              >
                <Message message="foo" />
              </IntlMessagesProvider>
            </WithInheritedMessages>
          </td>
          <td>
            <WithInheritedMessages>
              <IntlMessagesProvider
                loaderFn={fetchMessages}
                defaultMessages={{ bar: 'Custom bar default message' }}
              >
                <Message message="bar" />
              </IntlMessagesProvider>
            </WithInheritedMessages>
          </td>
        </tr>
        <tr>
          <td>Without inherited messages</td>
          <td>
            <IntlMessagesProvider
              loaderFn={fetchMessages}
              defaultMessages={{ foo: 'Custom foo default message' }}
            >
              <Message message="foo" />
            </IntlMessagesProvider>
          </td>
          <td>
            <IntlMessagesProvider
              loaderFn={fetchMessages}
              defaultMessages={{ bar: 'Custom bar default message' }}
            >
              <Message message="bar" />
            </IntlMessagesProvider>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
