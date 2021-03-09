import React, { forwardRef, useEffect } from 'react';
import { mount } from 'enzyme';

import {
  AnalyticsEventPayload,
  AnalyticsListener,
  createAndFireEvent,
  CreateUIAnalyticsEvent,
  WithAnalyticsEventsProps,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context/MediaAnalyticsContext';

import { ANALYTICS_MEDIA_CHANNEL } from '../../analytics/constants';
import {
  ContextPublicAttributes,
  ContextStaticProps,
} from '../../analytics/types';
import { withMediaAnalyticsContext } from '../../analytics/withMediaAnalyticsContext';

import { MediaFeatureFlags } from '../../mediaFeatureFlags';

describe('withMediaAnalyticsContext()', () => {
  const setup = (analyticsEventPayload: AnalyticsEventPayload = {}) => {
    const fireAnalyticsEvent = (createAnalyticsEvent: CreateUIAnalyticsEvent) =>
      createAndFireEvent(ANALYTICS_MEDIA_CHANNEL)(analyticsEventPayload)(
        createAnalyticsEvent,
      );

    const MediaComponentFiringAnalyticsEvent: React.FC<
      ContextStaticProps & WithAnalyticsEventsProps
    > = ({ createAnalyticsEvent }) => {
      useEffect(() => {
        if (!createAnalyticsEvent) {
          return expect(createAnalyticsEvent).toBeDefined();
        }
        fireAnalyticsEvent(createAnalyticsEvent);
      });

      return <div></div>;
    };

    const someContextData: ContextPublicAttributes = {
      packageName: 'packageName',
      packageVersion: 'packageVersion',
      componentName: 'componentName',
      component: 'component',
    };

    return {
      MediaComponentFiringAnalyticsEvent: withAnalyticsEvents()(
        MediaComponentFiringAnalyticsEvent,
      ),
      someContextData,
    };
  };

  it('should create MediaAnalyticsContext containing package infos and feature flags', () => {
    const analyticsEventPayload = { test: 'ok' };
    const someFeatureFlags: MediaFeatureFlags = {
      codeViewer: true,
      zipPreviews: true,
    };
    const onEvent = jest.fn();

    const { MediaComponentFiringAnalyticsEvent, someContextData } = setup(
      analyticsEventPayload,
    );

    const MediaComponentFiringAnalyticsEventWithContext = withMediaAnalyticsContext(
      someContextData,
    )(MediaComponentFiringAnalyticsEvent);

    mount(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_MEDIA_CHANNEL}>
        <MediaComponentFiringAnalyticsEventWithContext
          featureFlags={someFeatureFlags}
        />
      </AnalyticsListener>,
    );

    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        context: expect.arrayContaining([
          {
            ...someContextData,
            [MEDIA_CONTEXT]: {
              featureFlags: someFeatureFlags,
            },
          },
        ]),
        payload: analyticsEventPayload,
        hasFired: true,
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );
  });

  it('should filter feature flags if filter is provided', () => {
    const analyticsEventPayload = { test: 'ok' };
    const filteredFlags: MediaFeatureFlags = {
      poll_maxIntervalMs: 10,
      newCardExperience: false,
    };
    const someFeatureFlags: MediaFeatureFlags = {
      codeViewer: true,
      zipPreviews: true,
      poll_intervalMs: 10,
      ...filteredFlags,
    };
    const onEvent = jest.fn();

    const { MediaComponentFiringAnalyticsEvent, someContextData } = setup(
      analyticsEventPayload,
    );

    const MediaComponentFiringAnalyticsEventWithContext = withMediaAnalyticsContext(
      someContextData,
      {
        filterFeatureFlags: ['poll_maxIntervalMs', 'newCardExperience'],
      },
    )(MediaComponentFiringAnalyticsEvent);

    mount(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_MEDIA_CHANNEL}>
        <MediaComponentFiringAnalyticsEventWithContext
          featureFlags={someFeatureFlags}
        />
      </AnalyticsListener>,
    );

    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        context: expect.arrayContaining([
          {
            ...someContextData,
            [MEDIA_CONTEXT]: {
              featureFlags: filteredFlags,
            },
          },
        ]),
        payload: analyticsEventPayload,
        hasFired: true,
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );
  });

  it('should allow passing React refs', () => {
    const { someContextData } = setup();
    const someRef = React.createRef<HTMLButtonElement>();

    const FancyButton = forwardRef<HTMLButtonElement, ContextStaticProps>(
      (props, ref) => (
        <button ref={ref} className="FancyButton">
          {props.children}
        </button>
      ),
    );

    const WrappedFancyButton = withMediaAnalyticsContext(someContextData)(
      FancyButton,
    );

    const wrapper = mount(<WrappedFancyButton ref={someRef} />);

    expect(wrapper.find(FancyButton).length).toEqual(1);
  });
});
