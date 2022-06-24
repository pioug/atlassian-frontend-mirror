import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { IntlProvider, FormattedMessage } from 'react-intl-next';

import { I18nProvider } from '../I18nProvider';

jest.mock('@atlassian/embedded-confluence-common/i18n', () => ({
  zh: {
    'my.test.no-translate': '我的测试',
  },
  en: {
    'my.test.no-translate': 'My Test',
  },
}));

it('should localized text based on provided locale', async () => {
  const { getByText } = render(
    <IntlProvider locale="zh">
      <I18nProvider>
        <FormattedMessage
          id="my.test.no-translate"
          defaultMessage={'My Test'}
        />
      </I18nProvider>
    </IntlProvider>,
  );

  expect(await waitForElement(() => getByText('我的测试'))).toBeInTheDocument();
});

it('should localized text properly if long locale code with dash (-) is provided', async () => {
  const { getByText } = render(
    <IntlProvider locale="zh-CN">
      <I18nProvider>
        <FormattedMessage
          id="my.test.no-translate"
          defaultMessage={'My Test'}
        />
      </I18nProvider>
    </IntlProvider>,
  );

  expect(await waitForElement(() => getByText('我的测试'))).toBeInTheDocument();
});

it('should fallback to default locale if provided locale is not supported', async () => {
  const { getByText } = render(
    <IntlProvider locale="is-IS">
      <I18nProvider>
        <FormattedMessage
          id="my.test.no-translate"
          defaultMessage={'My Test'}
        />
      </I18nProvider>
    </IntlProvider>,
  );

  expect(await waitForElement(() => getByText('My Test'))).toBeInTheDocument();
});

it('should localized text properly if locale is provided as prop', async () => {
  const { getByText } = render(
    <I18nProvider locale="zh-CN">
      <FormattedMessage id="my.test.no-translate" defaultMessage={'My Test'} />
    </I18nProvider>,
  );

  expect(await waitForElement(() => getByText('我的测试'))).toBeInTheDocument();
});
