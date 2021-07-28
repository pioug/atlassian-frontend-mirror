import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import type { ErrorPayload } from '../../channel';
import {
  triggerAnalyticsForStepsAddedSuccessfully,
  triggerAnalyticsForStepsRejected,
  triggerAnalyticsForCatchupFailed,
  triggerAnalyticsForCatchupSuccessfulWithLatency,
  fireAnalyticsEvent,
} from '../index';
import {
  CATCHUP_FAILURE,
  CATCHUP_SUCCESS,
  STEPS_REJECTED,
  STEPS_ADDED,
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
    it('call triggerAnalyticsForStepsAddedSuccessfully should trigger fireAnalyticsEvent and add relevant data', async () => {
      triggerAnalyticsForStepsAddedSuccessfully(fakeAnalyticsWebClient);
      expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledTimes(1);
      expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
        action: 'collab',
        actionSubject: STEPS_ADDED,
        attributes: {
          packageName: 'collabProvider',
          payload: undefined,
        },
        source: 'unknown',
      });
    });

    it('call triggerAnalyticsForStepsRejected should trigger fireAnalyticsEvent and add relevant data', async () => {
      triggerAnalyticsForStepsRejected(
        fakeAnalyticsWebClient,
        stepRejectedError,
      );
      expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledTimes(1);
      expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
        action: 'collab',
        actionSubject: STEPS_REJECTED,
        attributes: {
          packageName: 'collabProvider',
          payload: stepRejectedError,
        },
        source: 'unknown',
      });
    });

    it('call triggerAnalyticsForCatchupSuccessfully should trigger fireAnalyticsEvent and add relevant data', async () => {
      triggerAnalyticsForCatchupSuccessfulWithLatency(
        fakeAnalyticsWebClient,
        200,
      );
      expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledTimes(1);
      expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
        action: 'collab',
        actionSubject: CATCHUP_SUCCESS,
        attributes: {
          packageName: 'collabProvider',
          payload: 200,
        },
        source: 'unknown',
      });
    });

    it('call triggerAnalyticsForCatchupFailed should trigger fireAnalyticsEvent and add relevant data', async () => {
      const catchupError: ErrorPayload = {
        data: {
          status: 500,
          code: 'CATCHUP_FAILED',
        },
        message: 'Cannot fetch catchup from collab service',
      };
      triggerAnalyticsForCatchupFailed(fakeAnalyticsWebClient, catchupError);
      expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledTimes(1);
      expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
        action: 'collab',
        actionSubject: CATCHUP_FAILURE,
        attributes: {
          packageName: 'collabProvider',
          payload: catchupError,
        },
        source: 'unknown',
      });
    });
  });
});
