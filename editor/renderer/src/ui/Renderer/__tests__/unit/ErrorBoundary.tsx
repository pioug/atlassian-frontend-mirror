import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { ErrorBoundary } from '../../ErrorBoundary';
import { ComponentCrashErrorAEP, PLATFORM } from '../../../../analytics/events';
import {
  ACTION,
  EVENT_TYPE,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
} from '../../../../analytics/enums';

describe('ErrorBoundary', () => {
  let mockCreateAnalyticsEvent: jest.Mock;
  let wrapper: ReactWrapper;

  const CustomError = new Error('oops');
  const BrokenComponent = (): never => {
    throw CustomError;
  };

  beforeEach(() => {
    mockCreateAnalyticsEvent = jest.fn(
      () =>
        ({
          fire: () => {},
        } as UIAnalyticsEvent),
    );
  });
  afterEach(() => {
    mockCreateAnalyticsEvent.mockClear();
    wrapper?.length && wrapper.unmount();
  });

  it('should dispatch an event if props.createAnalyticsEvent exists', () => {
    wrapper = mount(
      <ErrorBoundary
        component={ACTION_SUBJECT.RENDERER}
        createAnalyticsEvent={mockCreateAnalyticsEvent}
      >
        <BrokenComponent />
      </ErrorBoundary>,
    );

    const expectedAnalyticsEvent: ComponentCrashErrorAEP = {
      action: ACTION.CRASHED,
      actionSubject: ACTION_SUBJECT.RENDERER,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: expect.objectContaining({
        platform: PLATFORM.WEB,
        errorMessage: CustomError.message,
        errorStack: CustomError.stack,
        componentStack: expect.any(String),
        errorRethrown: false,
      }),
    };

    expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith(
      expectedAnalyticsEvent,
    );
  });

  it('should dispatch an event with actionSubjectId if props.createAnalyticsEvent and props.componentId exists', () => {
    wrapper = mount(
      <ErrorBoundary
        createAnalyticsEvent={mockCreateAnalyticsEvent}
        component={ACTION_SUBJECT.RENDERER}
        componentId={ACTION_SUBJECT_ID.HEADING_ANCHOR_LINK}
      >
        <BrokenComponent />
      </ErrorBoundary>,
    );

    const expectedAnalyticsEvent: ComponentCrashErrorAEP = {
      action: ACTION.CRASHED,
      actionSubject: ACTION_SUBJECT.RENDERER,
      actionSubjectId: ACTION_SUBJECT_ID.HEADING_ANCHOR_LINK,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: expect.objectContaining({
        platform: PLATFORM.WEB,
        errorMessage: CustomError.message,
        errorStack: CustomError.stack,
        componentStack: expect.any(String),
        errorRethrown: false,
      }),
    };

    expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith(
      expectedAnalyticsEvent,
    );
  });

  it('should NOT dispatch an event if props.createAnalyticsEvent does NOT exist', () => {
    wrapper = mount(
      <ErrorBoundary component={ACTION_SUBJECT.RENDERER}>
        <BrokenComponent />
      </ErrorBoundary>,
    );
    expect(mockCreateAnalyticsEvent).not.toHaveBeenCalled();
  });

  it('should render props.fallbackComponent if props.fallbackComponent exists', () => {
    const ExampleFallback = <div className="my-fallback" />;

    wrapper = mount(
      <ErrorBoundary
        createAnalyticsEvent={mockCreateAnalyticsEvent}
        component={ACTION_SUBJECT.RENDERER}
        fallbackComponent={ExampleFallback}
      >
        <BrokenComponent />
      </ErrorBoundary>,
    );
    expect(wrapper.find('.my-fallback').length).toEqual(1);
  });

  it('should NOT render props.fallbackComponent if zero render errors', () => {
    const GoodComponent = () => <div className="working" />;
    const ExampleFallback = <div className="my-fallback" />;

    wrapper = mount(
      <ErrorBoundary
        createAnalyticsEvent={mockCreateAnalyticsEvent}
        component={ACTION_SUBJECT.RENDERER}
        fallbackComponent={ExampleFallback}
      >
        <GoodComponent />
      </ErrorBoundary>,
    );
    expect(wrapper.find('.my-fallback').length).toEqual(0);
  });

  it('should throw errors upward when props.rethrowError is true and include rethrow info in event', () => {
    try {
      wrapper = mount(
        <ErrorBoundary
          createAnalyticsEvent={mockCreateAnalyticsEvent}
          component={ACTION_SUBJECT.RENDERER}
          fallbackComponent={null}
          rethrowError
        >
          <BrokenComponent />
        </ErrorBoundary>,
      );
    } catch (err) {
      expect(err).toBe(CustomError);
    }
    const expectedAnalyticsEvent: ComponentCrashErrorAEP = {
      action: ACTION.CRASHED,
      actionSubject: ACTION_SUBJECT.RENDERER,
      actionSubjectId: undefined,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: expect.objectContaining({
        platform: PLATFORM.WEB,
        errorMessage: CustomError.message,
        errorStack: CustomError.stack,
        componentStack: expect.any(String),
        errorRethrown: true,
      }),
    };

    expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith(
      expectedAnalyticsEvent,
    );
  });

  it('should NOT throw errors upward when props.rethrowErrors is false', () => {
    try {
      wrapper = mount(
        <ErrorBoundary
          createAnalyticsEvent={mockCreateAnalyticsEvent}
          component={ACTION_SUBJECT.RENDERER}
          fallbackComponent={null}
          rethrowError={false}
        >
          <BrokenComponent />
        </ErrorBoundary>,
      );
    } catch (err) {
      expect(err).toBe(undefined);
    }
    const expectedAnalyticsEvent: ComponentCrashErrorAEP = {
      action: ACTION.CRASHED,
      actionSubject: ACTION_SUBJECT.RENDERER,
      actionSubjectId: undefined,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: expect.objectContaining({
        platform: PLATFORM.WEB,
        errorMessage: CustomError.message,
        errorStack: CustomError.stack,
        componentStack: expect.any(String),
        errorRethrown: false,
      }),
    };

    expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith(
      expectedAnalyticsEvent,
    );
  });
});
