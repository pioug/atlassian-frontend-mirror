import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import type { ErrorPayload } from '../../types';
import { triggerAnalyticsEvent } from '../index';
import { EVENT_ACTION, EVENT_STATUS } from '../../helpers/const';

import {
  name as packageName,
  version as packageVersion,
} from '../../version-wrapper';

describe('Analytics helper function', () => {
  const fakeAnalyticsWebClient: AnalyticsWebClient = {
    sendOperationalEvent: jest.fn(),
    sendScreenEvent: jest.fn(),
    sendTrackEvent: jest.fn(),
    sendUIEvent: jest.fn(),
  };
  const originalRequestIdleCallback = (window as any).requestIdleCallback;

  beforeAll(() => {
    (window as any).requestIdleCallback = undefined;
  });

  afterAll(() => {
    (window as any).requestIdleCallback = originalRequestIdleCallback;
  });

  beforeEach(() => {
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementationOnce((cb) => (cb as Function)());
  });

  afterEach(jest.resetAllMocks);

  it('should send an analytics event without attributes', () => {
    triggerAnalyticsEvent(
      {
        eventAction: EVENT_ACTION.UPDATE_PARTICIPANTS,
        attributes: {},
      },
      fakeAnalyticsWebClient,
    );

    expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledTimes(1);
    expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
      action: 'updateParticipants',
      actionSubject: 'collab',
      attributes: {
        packageName,
        packageVersion,
        collabService: 'ncs',
      },
      tags: ['editor'],
      source: 'unknown',
    });
  });

  it('should send an analytics event with optional attributes', () => {
    triggerAnalyticsEvent(
      {
        eventAction: EVENT_ACTION.CONVERT_PM_TO_ADF,
        attributes: {
          documentAri:
            'ari:cloud:confluence:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:page/3110142491',
          eventStatus: EVENT_STATUS.SUCCESS,
          meetsSLO: true,
          latency: 123.45,
          participants: 3,
          numUnconfirmedSteps: 6,
        },
      },
      fakeAnalyticsWebClient,
    );

    expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledTimes(1);
    expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
      action: 'convertPMToADF',
      actionSubject: 'collab',
      attributes: {
        packageName,
        packageVersion,
        collabService: 'ncs',
        eventStatus: 'SUCCESS',
        latency: 123.45,
        meetsSLO: true,
        participants: 3,
        numUnconfirmedSteps: 6,
        documentAri:
          'ari:cloud:confluence:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:page/3110142491',
      },
      tags: ['editor'],
      source: 'unknown',
    });
  });

  it('should send an analytics event with error information', () => {
    const stepRejectedError: ErrorPayload = {
      data: {
        status: 409,
        code: 'HEAD_VERSION_UPDATE_FAILED',
        meta: 'The version number does not match the current head version.',
      },
      message: 'Version number does not match current head version.',
    };

    triggerAnalyticsEvent(
      {
        eventAction: EVENT_ACTION.CONNECTION,
        attributes: {
          eventStatus: EVENT_STATUS.FAILURE,
          error: stepRejectedError,
        },
      },
      fakeAnalyticsWebClient,
    );

    expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledTimes(1);
    expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
      action: 'connection',
      actionSubject: 'collab',
      attributes: {
        packageName,
        packageVersion,
        collabService: 'ncs',
        eventStatus: 'FAILURE',
        error: stepRejectedError,
      },
      tags: ['editor'],
      source: 'unknown',
    });
  });
});
