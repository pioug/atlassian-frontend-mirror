import React from 'react';
import { render } from '@testing-library/react';
import { ErrorBoundary } from '../..';
import { ACTION, EVENT_TYPE } from '../../../../';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';

describe('ErrorBoundary', () => {
  let mockDispatchAnalyticsEvent: jest.MockedFunction<DispatchAnalyticsEvent>;

  const CustomError = new Error('oops');
  const BrokenComponent = (): never => {
    throw CustomError;
  };

  beforeEach(() => {
    mockDispatchAnalyticsEvent = jest.fn();
  });
  afterEach(() => {
    mockDispatchAnalyticsEvent.mockClear();
  });

  it('should dispatch an event if props.dispatchAnalyticsEvent exists', () => {
    render(
      <ErrorBoundary
        component={ACTION_SUBJECT.TABLES_PLUGIN}
        dispatchAnalyticsEvent={mockDispatchAnalyticsEvent}
      >
        <BrokenComponent />
      </ErrorBoundary>,
    );

    const expectedAnalyticsEvent = {
      action: ACTION.EDITOR_CRASHED,
      actionSubject: ACTION_SUBJECT.TABLES_PLUGIN,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: {
        error: CustomError,
        errorInfo: expect.objectContaining({
          componentStack: expect.any(String),
        }),
        errorRethrown: true,
      },
    };

    expect(mockDispatchAnalyticsEvent).toHaveBeenCalledWith(
      expectedAnalyticsEvent,
    );
  });

  it('should dispatch an event with actionSubjectId if props.dispatchAnalyticsEvent and props.componentId exists', () => {
    render(
      <ErrorBoundary
        component={ACTION_SUBJECT.REACT_NODE_VIEW}
        componentId={ACTION_SUBJECT_ID.STATUS}
        dispatchAnalyticsEvent={mockDispatchAnalyticsEvent}
      >
        <BrokenComponent />
      </ErrorBoundary>,
    );

    const expectedAnalyticsEvent = {
      action: ACTION.EDITOR_CRASHED,
      actionSubject: ACTION_SUBJECT.REACT_NODE_VIEW,
      actionSubjectId: ACTION_SUBJECT_ID.STATUS,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: {
        error: CustomError,
        errorInfo: expect.objectContaining({
          componentStack: expect.any(String),
        }),
        errorRethrown: true,
      },
    };

    expect(mockDispatchAnalyticsEvent).toHaveBeenCalledWith(
      expectedAnalyticsEvent,
    );
  });

  it('should NOT dispatch an event if props.dispatchAnalyticsEvent does NOT exist', () => {
    render(
      <ErrorBoundary component={ACTION_SUBJECT.TABLES_PLUGIN}>
        <BrokenComponent />
      </ErrorBoundary>,
    );
    expect(mockDispatchAnalyticsEvent).not.toHaveBeenCalled();
  });

  it('should render props.fallbackComponent if props.fallbackComponent exists', () => {
    const ExampleFallback = <div data-testid="my-fallback" />;

    const { getByTestId } = render(
      <ErrorBoundary
        component={ACTION_SUBJECT.TABLES_PLUGIN}
        fallbackComponent={ExampleFallback}
      >
        <BrokenComponent />
      </ErrorBoundary>,
    );
    expect(getByTestId('my-fallback')).toBeInTheDocument();
  });

  it('should NOT render props.fallbackComponent if zero render errors', () => {
    const GoodComponent = () => <div className="working" />;
    const ExampleFallback = <div className="my-fallback" />;

    const { queryByTestId } = render(
      <ErrorBoundary
        component={ACTION_SUBJECT.TABLES_PLUGIN}
        fallbackComponent={ExampleFallback}
      >
        <GoodComponent />
      </ErrorBoundary>,
    );
    expect(queryByTestId('my-fallback')).not.toBeInTheDocument();
  });
});
