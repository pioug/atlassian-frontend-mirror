import React from 'react';

import { render } from '@testing-library/react';
import { mount } from 'enzyme';

import AnalyticsErrorBoundary from '../../AnalyticsErrorBoundary';

const props = {
  channel: 'atlaskit',
  data: {
    componentName: 'button',
    packageName: '@atlaskit/button',
    componentVersion: '999.9.9',
  },
  children: <div className="child-component" />,
};

describe('AnalyticsErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the child component', () => {
    const onError = jest.fn();
    const wrapper = mount(
      <AnalyticsErrorBoundary {...props} onError={onError} />,
    );

    expect(onError).not.toHaveBeenCalled();
    expect(wrapper.find('.child-component')).toHaveLength(1);
  });

  it('should render error component when error occurs', async () => {
    const onError = jest.fn();

    const error = new Error('Error');
    const Something = (p: { error: boolean }) => {
      if (p.error) {
        throw error;
      }
      // this is just a placeholder
      return <div className="child-component" />;
    };

    const ErrorScreen = () => {
      return <div>Error occurred</div>;
    };

    const { findByText } = render(
      <AnalyticsErrorBoundary
        {...props}
        ErrorComponent={ErrorScreen}
        onError={onError}
      >
        <Something error />
      </AnalyticsErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(await findByText('Error occurred')).toBeInTheDocument();
  });

  it('should render empty DOM when error occurs and no ErrorComponent', async () => {
    const onError = jest.fn();

    const error = new Error('Error');
    const Something = (p: { error: boolean }) => {
      if (p.error) {
        throw error;
      }
      // this is just a placeholder
      return <div className="child-component" />;
    };

    const { container } = render(
      <AnalyticsErrorBoundary {...props} onError={onError}>
        <Something error />
      </AnalyticsErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(container).toBeEmptyDOMElement();
  });
});
