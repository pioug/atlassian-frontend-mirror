import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import type { ErrorPayload } from '../../types';
import { fireAnalyticsEvent, triggerCollabAnalyticsEvent } from '../index';
import {
  ATTRIBUTES_PACKAGE,
  EVENT_ACTION,
  EVENT_STATUS,
  EVENT_SUBJECT,
} from '../../helpers/const';

describe('Sending analytics', () => {
  let fakeAnalyticsWebClient: AnalyticsWebClient = {
    sendOperationalEvent: jest.fn(),
    sendScreenEvent: jest.fn(),
    sendTrackEvent: jest.fn(),
    sendUIEvent: jest.fn(),
  };
  const stepRejectedError: ErrorPayload = {
    data: {
      status: 409,
      code: 'HEAD_VERSION_UPDATE_FAILED',
      meta: 'The version number does not match the current head version.',
    },
    message: 'Version number does not match current head version.',
  };
  let originalRequestIdleCallback: Function | undefined;
  describe('when fireAnalyticsEvent is called', () => {
    let originalRequestIdleCallback: Function | undefined;
    beforeEach(() => {
      jest.spyOn(window, 'requestAnimationFrame');
      originalRequestIdleCallback = (window as any).requestIdleCallback;
      (window as any).requestIdleCallback = undefined;
      (window.requestAnimationFrame as jest.Mock).mockImplementation((cb) =>
        (cb as Function)(),
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
      (window.requestAnimationFrame as jest.Mock).mockRestore();
      (window as any).requestIdleCallback = originalRequestIdleCallback;
    });
    it('should preserve original values and add `action: collab` by default ', () => {
      fireAnalyticsEvent(fakeAnalyticsWebClient, {
        actionSubject: 'testSubject',
        source: 'neverland',
      });

      expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith(
        expect.objectContaining({
          action: 'collab',
          actionSubject: 'testSubject',
          source: 'neverland',
          tags: ['editor'],
        }),
      );
    });

    it('should add "unknown" source as default', () => {
      fireAnalyticsEvent(fakeAnalyticsWebClient, {
        actionSubject: 'testSubject',
      });

      expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith(
        expect.objectContaining({ source: 'unknown' }),
      );
    });
  });

  describe('trigger analytics for events', () => {
    beforeEach(() => {
      jest.spyOn(window, 'requestAnimationFrame');
      originalRequestIdleCallback = (window as any).requestIdleCallback;
      (window as any).requestIdleCallback = undefined;
      (window.requestAnimationFrame as jest.Mock).mockImplementation((cb) =>
        (cb as Function)(),
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
      (window.requestAnimationFrame as jest.Mock).mockRestore();
      (window as any).requestIdleCallback = originalRequestIdleCallback;
    });

    it('call triggerCollabAnalyticsEvent should trigger fireAnalyticsEvent and add relevant data', async () => {
      triggerCollabAnalyticsEvent(
        {
          eventAction: EVENT_ACTION.ADD_STEPS,
          attributes: {
            eventStatus: EVENT_STATUS.SUCCESS,
            latency: 200.13,
            meetsSLO: true,
            participants: 3,
            documentAri: 'abc',
          },
        },
        fakeAnalyticsWebClient,
      );
      expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledTimes(1);
      expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
        action: EVENT_ACTION.ADD_STEPS,
        actionSubject: EVENT_SUBJECT,
        attributes: {
          collabService: 'ncs',
          packageName: ATTRIBUTES_PACKAGE,
          eventStatus: EVENT_STATUS.SUCCESS,
          latency: 200.13,
          meetsSLO: true,
          participants: 3,
          documentAri: 'abc',
        },
        source: 'unknown',
        tags: ['editor'],
      });
    });

    it('call triggerCollabAnalyticsEvent with an error should trigger fireAnalyticsEvent and add relevant data', async () => {
      triggerCollabAnalyticsEvent(
        {
          eventAction: EVENT_ACTION.ADD_STEPS,
          attributes: {
            eventStatus: EVENT_STATUS.FAILURE,
            latency: 200.13,
            meetsSLO: true,
            error: stepRejectedError,
          },
        },
        fakeAnalyticsWebClient,
      );
      expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledTimes(1);
      expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
        action: EVENT_ACTION.ADD_STEPS,
        actionSubject: EVENT_SUBJECT,
        attributes: {
          collabService: 'ncs',
          packageName: ATTRIBUTES_PACKAGE,
          eventStatus: EVENT_STATUS.FAILURE,
          latency: 200.13,
          meetsSLO: true,
          error: stepRejectedError,
        },
        tags: ['editor'],
        source: 'unknown',
      });
    });
  });
});
