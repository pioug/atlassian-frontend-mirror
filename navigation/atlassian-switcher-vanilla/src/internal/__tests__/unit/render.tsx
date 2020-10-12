import React from 'react';
import { shallow } from 'enzyme';

describe('render', () => {
  const renderMock = jest.fn();
  const unmountComponentAtNodeMock = jest.fn();

  beforeEach(() => {
    renderMock.mockReset();
    unmountComponentAtNodeMock.mockReset();

    jest.resetModules();

    jest.doMock('react-dom', () => ({
      render: renderMock,
      unmountComponentAtNode: unmountComponentAtNodeMock,
    }));
  });

  test('should render the switcher with analytics and intl providers', () => {
    let result;

    renderMock.mockImplementation(content => {
      result = shallow(<div>{content}</div>);
    });

    const { render } = require('../../render');

    const noop = () => {};

    render(
      {
        appearance: 'standalone',
        cloudId: 'some-cloud-id',
        disableCustomLinks: true,
        disableHeadings: true,
        disableRecentContainers: true,
        product: 'opsgenie',
      },
      noop,
      document.createElement('div'),
    );

    expect(result).toMatchSnapshot();
  });

  test('should provide a method to destroy the switcher after rendered', () => {
    const { render } = require('../../render');

    const noop = () => {};
    const div = document.createElement('div');

    const renderedSwitcher = render(
      {
        appearance: 'standalone',
        cloudId: 'some-cloud-id',
        disableCustomLinks: true,
        disableHeadings: true,
        disableRecentContainers: true,
        product: 'opsgenie',
      },
      noop,
      div,
    );

    expect(unmountComponentAtNodeMock).toHaveBeenCalledTimes(0);

    renderedSwitcher.destroy();

    expect(unmountComponentAtNodeMock).toHaveBeenCalledWith(div);
  });
});
