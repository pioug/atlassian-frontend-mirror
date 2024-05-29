import React from 'react';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { mount, ReactWrapper } from 'enzyme';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { ErrorBoundary } from '../../ErrorBoundary';
import type { ComponentCrashErrorAEP } from '../../../../analytics/events';
import { PLATFORM } from '../../../../analytics/events';
import {
  ACTION,
  EVENT_TYPE,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';

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
        componentStack: expect.any(String),
        errorRethrown: false,
      }),
    };

    expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith(
      expectedAnalyticsEvent,
    );
    expect(mockCreateAnalyticsEvent).not.toHaveBeenCalledWith(
      expect.objectContaining({
        nonPrivacySafeAttributes: expect.any(Object),
      }),
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
        componentStack: expect.any(String),
        errorRethrown: false,
      }),
    };

    expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith(
      expectedAnalyticsEvent,
    );
    expect(mockCreateAnalyticsEvent).not.toHaveBeenCalledWith(
      expect.objectContaining({
        nonPrivacySafeAttributes: expect.any(Object),
      }),
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
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
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
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
    const GoodComponent = () => <div className="working" />;
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
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
        componentStack: expect.any(String),
        errorRethrown: true,
      }),
    };

    expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith(
      expectedAnalyticsEvent,
    );
    expect(mockCreateAnalyticsEvent).not.toHaveBeenCalledWith(
      expect.objectContaining({
        nonPrivacySafeAttributes: expect.any(Object),
      }),
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
        componentStack: expect.any(String),
        errorRethrown: false,
      }),
    };

    expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith(
      expectedAnalyticsEvent,
    );
    expect(mockCreateAnalyticsEvent).not.toHaveBeenCalledWith(
      expect.objectContaining({
        nonPrivacySafeAttributes: expect.any(Object),
      }),
    );
  });
});
