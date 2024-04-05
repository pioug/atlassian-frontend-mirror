import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl-next';

import { ViewPage } from '../ViewPage';

const defaultProps = {
  contentId: '123',
  spaceKey: 'TEST',
  parentProduct: 'test',
  parentProductContentContainerId: '10000',
};

const mockDefaultHost = 'mock.host';
const mockDefaultProtocol = 'abc:';
const originalLocation: Location = window.location;

beforeEach(() => {
  // @ts-ignore Mock window.location in Jest
  delete window.location;

  window.location = {
    ...originalLocation,
    host: mockDefaultHost,
    protocol: mockDefaultProtocol,
  };
});

afterEach(() => {
  window.location = originalLocation;
});

it('should use default locale to localize text by if no locale is provided', async () => {
  render(<ViewPage {...defaultProps} />);

  const iframe = await screen.findByTestId('confluence-page-iframe');
  expect(iframe).toHaveAttribute(
    'src',
    `${mockDefaultProtocol}//${mockDefaultHost}/wiki/spaces/TEST/pages/123?parentProduct=test&parentProductContentContainerId=10000&locale=en-US`,
  );
});

it('should localize text by locale provided by React prop', async () => {
  render(<ViewPage {...defaultProps} locale="zh-CN" />);

  const iframe = await screen.findByTestId('confluence-page-iframe');
  expect(iframe).toHaveAttribute(
    'src',
    `${mockDefaultProtocol}//${mockDefaultHost}/wiki/spaces/TEST/pages/123?parentProduct=test&parentProductContentContainerId=10000&locale=zh-CN`,
  );
});

it('should localize text by locale provided by IntlProvider', async () => {
  render(
    <IntlProvider locale="zh-CN">
      <ViewPage {...defaultProps} />
    </IntlProvider>,
  );

  const iframe = await screen.findByTestId('confluence-page-iframe');
  expect(iframe).toHaveAttribute(
    'src',
    `${mockDefaultProtocol}//${mockDefaultHost}/wiki/spaces/TEST/pages/123?parentProduct=test&parentProductContentContainerId=10000&locale=zh-CN`,
  );
});
