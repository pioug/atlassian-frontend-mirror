import {
  AnalyticsPayload,
  AnalyticsStep,
  AnalyticsWithChannel,
} from '../../analytics';

describe('Analytics Step', () => {
  it('should change analytics payload with undo event when inverted', function () {
    const event: AnalyticsWithChannel<AnalyticsPayload> = {
      channel: 'test',
      payload: {
        action: 'test-action',
        actionSubject: 'test-action-subject',
        eventType: 'test-event-type',
        attributes: {
          inputMethod: 'keyboard',
        },
      },
    };
    let analyticsStep = new AnalyticsStep([event]);
    expect(analyticsStep.analyticsEvents[0]).toEqual(event);

    analyticsStep = analyticsStep.invert();
    expect(analyticsStep.analyticsEvents[0]).toEqual({
      ...event,
      payload: {
        ...event.payload,
        action: 'undid',
        actionSubjectId: event.payload.action,
        attributes: {
          ...(event.payload.attributes ? event.payload.attributes : {}),
          actionSubjectId: event.payload.actionSubjectId,
          inputMethod: 'keyboard',
        },
        eventType: 'track',
      },
    });
  });

  it('should change analytics payload with redid event when inverted twice', function () {
    const event: AnalyticsWithChannel<AnalyticsPayload> = {
      channel: 'test',
      payload: {
        action: 'test-action',
        actionSubject: 'test-action-subject',
        eventType: 'test-event-type',
        attributes: {
          inputMethod: 'keyboard',
        },
      },
    };

    let analyticsStep = new AnalyticsStep([event]);
    expect(analyticsStep.analyticsEvents[0]).toEqual(event);

    analyticsStep = analyticsStep.invert().invert();
    expect(analyticsStep.analyticsEvents[0]).toEqual({
      ...event,
      payload: {
        ...event.payload,
        action: 'redid',
        actionSubjectId: event.payload.action,
        attributes: {
          ...(event.payload.attributes ? event.payload.attributes : {}),
          actionSubjectId: event.payload.actionSubjectId,
          inputMethod: 'keyboard',
        },
        eventType: 'track',
      },
    });
  });
});
