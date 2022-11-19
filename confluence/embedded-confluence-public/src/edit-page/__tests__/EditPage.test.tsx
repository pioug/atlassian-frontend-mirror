import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl-next';

import { EditPage } from '../EditPage';

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
  render(<EditPage {...defaultProps} />);

  expect(await screen.findByTestId('confluence-page-iframe')).toHaveAttribute(
    'src',
    `${mockDefaultProtocol}//${mockDefaultHost}/wiki/spaces/TEST/pages/edit-embed/123?parentProduct=test&parentProductContentContainerId=10000&locale=en-US`,
  );
});

it('should localize text by locale provided by React prop', async () => {
  render(<EditPage {...defaultProps} locale="zh-CN" />);

  expect(await screen.findByTestId('confluence-page-iframe')).toHaveAttribute(
    'src',
    `${mockDefaultProtocol}//${mockDefaultHost}/wiki/spaces/TEST/pages/edit-embed/123?parentProduct=test&parentProductContentContainerId=10000&locale=zh-CN`,
  );
});

it('should localize text by locale provided by IntlProvider', async () => {
  render(
    <IntlProvider locale="zh-CN">
      <EditPage {...defaultProps} />
    </IntlProvider>,
  );

  expect(await screen.findByTestId('confluence-page-iframe')).toHaveAttribute(
    'src',
    `${mockDefaultProtocol}//${mockDefaultHost}/wiki/spaces/TEST/pages/edit-embed/123?parentProduct=test&parentProductContentContainerId=10000&locale=zh-CN`,
  );
});
