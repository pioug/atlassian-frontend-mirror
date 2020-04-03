import { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { analyticsBridgeClient } from '../../analytics-client';

describe('Analytics Client', () => {
  let handleAnalyticsEvent: jest.Mock;
  let analyticsClient: AnalyticsWebClient;

  beforeEach(() => {
    handleAnalyticsEvent = jest.fn();
    analyticsClient = analyticsBridgeClient(handleAnalyticsEvent);
  });

  it('calls analytics event handler adding event type for UI events', () => {
    const uiEvent = {
      actionSubject: 'editor',
      action: 'started',
    };
    analyticsClient.sendUIEvent(uiEvent);

    expect(handleAnalyticsEvent).toHaveBeenCalledWith({
      ...uiEvent,
      eventType: 'ui',
    });
  });

  it('calls analytics event handler adding event type for operational events', () => {
    const operationalEvent = {
      actionSubject: 'editor',
      action: 'dispatchedInvalidTransaction',
    };
    analyticsClient.sendOperationalEvent(operationalEvent);

    expect(handleAnalyticsEvent).toHaveBeenCalledWith({
      ...operationalEvent,
      eventType: 'operational',
    });
  });

  it('calls analytics event handler adding event type for track events', () => {
    const trackEvent = {
      actionSubject: 'panel',
      action: 'deleted',
    };
    analyticsClient.sendTrackEvent(trackEvent);

    expect(handleAnalyticsEvent).toHaveBeenCalledWith({
      ...trackEvent,
      eventType: 'track',
    });
  });

  it('calls analytics event handler adding event type for screen events', () => {
    const screenEvent = {
      name: 'editor',
      action: 'viewed',
    };
    analyticsClient.sendScreenEvent(screenEvent);

    expect(handleAnalyticsEvent).toHaveBeenCalledWith({
      ...screenEvent,
      eventType: 'screen',
    });
  });
});
