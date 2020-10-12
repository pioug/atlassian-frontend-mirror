import {
  createAndFireEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import React from 'react';

export type Props = WithAnalyticsEventsProps & {
  text?: string;
  onClick: (e: React.SyntheticEvent) => void;
};

class DummyComponent extends React.Component<Props> {
  render() {
    const { onClick, text } = this.props;
    return (
      <div id="dummy" onClick={onClick} style={{ paddingBottom: 12 }}>
        <button>{text || 'Test'}</button>
      </div>
    );
  }
}

export const createDummyComponentWithAnalytics = (channel?: string) =>
  withAnalyticsEvents({
    onClick: createAndFireEvent(channel)({
      action: 'someAction',
      actionSubject: 'someComponent',
      eventType: 'ui',
      attributes: {
        packageVersion: '1.0.0',
        packageName: '@atlaskit/foo',
        componentName: 'foo',
        foo: 'bar',
      },
    }),
  })(DummyComponent);
