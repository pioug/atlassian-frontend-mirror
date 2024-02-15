import {
  AnalyticsContext,
  createAndFireEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { token } from '@atlaskit/tokens';
import React from 'react';
import Logger, { LOG_LEVEL } from '../helpers/logger';

export const createLoggerMock = (): Logger =>
  ({
    logLevel: LOG_LEVEL.DEBUG,
    logMessage: jest.fn(),
    setLogLevel: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  } as Logger);

export const createAnalyticsContexts =
  (contexts: any[]) =>
  ({ children }: { children: React.ReactNode }) =>
    contexts
      .slice(0)
      .reverse()
      .reduce(
        (prev, curr) => <AnalyticsContext data={curr}>{prev}</AnalyticsContext>,
        children,
      );

export type Props = WithAnalyticsEventsProps & {
  text?: string;
  onClick: (e: React.SyntheticEvent) => void;
};

class DummyComponent extends React.Component<Props> {
  render() {
    const { onClick, text } = this.props;
    return (
      <div
        id="dummy"
        onClick={onClick}
        style={{ paddingBottom: token('space.150', '12px') }}
      >
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
