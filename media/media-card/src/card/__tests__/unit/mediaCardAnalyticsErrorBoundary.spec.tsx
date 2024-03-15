import React from 'react';
import { mount } from 'enzyme';
import MediaCardAnalyticsErrorBoundary from '../../media-card-analytics-error-boundary';
import * as analyticsModule from '../../../utils/analytics/analytics';
import { UnhandledErrorCard } from '../../ui/unhandledErrorCard';

const fireOperationalEvent = jest.spyOn(analyticsModule, 'fireMediaCardEvent');

class MockComponent extends React.Component<{ callFn?: Function }> {
  componentDidMount() {
    this.props?.callFn && this.props.callFn();
  }
  render(): React.ReactNode {
    return <div>Mock Component</div>;
  }
}
const rejectWithError = () => {
  throw new Error('whatever');
};

describe('MediaCardAnalyticsErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`should render child component with card layout`, () => {
    const component = mount(
      <MediaCardAnalyticsErrorBoundary>
        <MockComponent />
      </MediaCardAnalyticsErrorBoundary>,
    );
    expect(component.find(MockComponent).exists()).toBe(true);

    expect(component.find(UnhandledErrorCard).exists()).toBe(false);
  });

  it(`should render UnhandledErrorCard when error thrown`, () => {
    const component = mount(
      <MediaCardAnalyticsErrorBoundary>
        <MockComponent callFn={rejectWithError} />
      </MediaCardAnalyticsErrorBoundary>,
    );

    expect(component.find(UnhandledErrorCard).exists()).toBe(true);
  });

  it(`should fire operational event on rendering`, () => {
    mount(
      <MediaCardAnalyticsErrorBoundary>
        <MockComponent callFn={rejectWithError} />
      </MediaCardAnalyticsErrorBoundary>,
    );
    expect(fireOperationalEvent).toBeCalledTimes(1);
    expect(fireOperationalEvent).toBeCalledWith(
      {
        action: 'failed',
        actionSubject: 'mediaCardRender',
        attributes: {
          error: expect.objectContaining({ message: 'whatever' }),
          failReason: 'unexpected-error',
          info: {
            componentStack: expect.any(String),
          },
          browserInfo: expect.any(String),
        },
        eventType: 'operational',
      },
      expect.any(Function),
    );
  });
});
