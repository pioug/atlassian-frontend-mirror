import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { nextTick } from '@atlaskit/editor-test-helpers/next-tick';
import AnalyticsHelper from '../analytics-helper';
import { EVENT_ACTION, EVENT_STATUS } from '../../helpers/const';

import {
  name as packageName,
  version as packageVersion,
} from '../../version-wrapper';
import { InternalError, NCS_ERROR_CODE } from '../../errors/error-types';

describe('Analytics helper function', () => {
  const fakeAnalyticsWebClient: AnalyticsWebClient = {
    sendOperationalEvent: jest.fn(),
    sendScreenEvent: jest.fn(),
    sendTrackEvent: jest.fn(),
    sendUIEvent: jest.fn(),
  };
  const originalRequestIdleCallback = (window as any).requestIdleCallback;
  const fakeDocumentAri =
    'ari:cloud:confluence:a436116f-02ce-4520-8fbb-7301462a1674:page/1731046230';
  let analyticsHelper: AnalyticsHelper;

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

    analyticsHelper = new AnalyticsHelper(
      fakeDocumentAri,
      fakeAnalyticsWebClient,
    );
  });

  afterEach(jest.clearAllMocks);

  it('should send an analytics event without attributes', () => {
    analyticsHelper.sendActionEvent(
      EVENT_ACTION.UPDATE_PARTICIPANTS,
      EVENT_STATUS.SUCCESS,
    );

    expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(
      1,
    );
    expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
      action: 'updateParticipants',
      actionSubject: 'collab',
      attributes: {
        packageName,
        packageVersion,
        collabService: 'ncs',
        network: {
          status: 'ONLINE',
        },
        documentAri: fakeDocumentAri,
        eventStatus: 'SUCCESS',
      },
      tags: ['editor'],
      source: 'unknown',
    });
  });

  it('should send an analytics event with optional attributes', () => {
    analyticsHelper.sendActionEvent(
      EVENT_ACTION.CONNECTION,
      EVENT_STATUS.SUCCESS,
      {
        meetsSLO: true,
        latency: 123.45,
        participants: 3,
        numUnconfirmedSteps: 6,
      },
    );

    expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(
      1,
    );
    expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
      action: 'connection',
      actionSubject: 'collab',
      attributes: {
        packageName,
        packageVersion,
        collabService: 'ncs',
        network: {
          status: 'ONLINE',
        },
        documentAri: fakeDocumentAri,
        eventStatus: 'SUCCESS',
        latency: 123.45,
        meetsSLO: true,
        participants: 3,
        numUnconfirmedSteps: 6,
      },
      tags: ['editor'],
      source: 'unknown',
    });
  });

  it('should send an analytics event with error information', () => {
    const stepRejectedError: InternalError = {
      data: {
        code: NCS_ERROR_CODE.HEAD_VERSION_UPDATE_FAILED,
        meta: {
          currentVersion: 3,
          incomingVersion: 4,
        },
        status: 409,
      },
      message: 'Version number does not match current head version.',
    };

    analyticsHelper.sendErrorEvent(
      stepRejectedError,
      'Meaningful Context-Aware Error Message',
    );

    expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(
      1,
    );
    expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
      action: 'error',
      actionSubject: 'collab',
      attributes: {
        packageName,
        packageVersion,
        collabService: 'ncs',
        network: {
          status: 'ONLINE',
        },
        documentAri: fakeDocumentAri,
        errorMessage: 'Meaningful Context-Aware Error Message',
      },
      nonPrivacySafeAttributes: {
        error: stepRejectedError,
      },
      tags: ['editor'],
      source: 'unknown',
    });
  });

  it('should send an analytics event when analytics client is get through getAnalyticsClient promise', async () => {
    const fakeGetAnalyticsClient = Promise.resolve(fakeAnalyticsWebClient);

    analyticsHelper = new AnalyticsHelper(
      fakeDocumentAri,
      undefined,
      fakeGetAnalyticsClient,
    );

    analyticsHelper.sendActionEvent(
      EVENT_ACTION.UPDATE_PARTICIPANTS,
      EVENT_STATUS.SUCCESS,
    );

    await nextTick();

    expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(
      1,
    );
    expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
      action: 'updateParticipants',
      actionSubject: 'collab',
      attributes: {
        packageName,
        packageVersion,
        collabService: 'ncs',
        network: {
          status: 'ONLINE',
        },
        documentAri: fakeDocumentAri,
        eventStatus: 'SUCCESS',
      },
      tags: ['editor'],
      source: 'unknown',
    });
  });

  it('should send an analytics event with error information when analytics client is get through getAnalyticsClient promise', async () => {
    const fakeGetAnalyticsClient = Promise.resolve(fakeAnalyticsWebClient);

    analyticsHelper = new AnalyticsHelper(
      fakeDocumentAri,
      undefined,
      fakeGetAnalyticsClient,
    );

    const stepRejectedError: InternalError = {
      data: {
        status: 409,
        code: NCS_ERROR_CODE.HEAD_VERSION_UPDATE_FAILED,
        meta: {
          currentVersion: 3,
          incomingVersion: 4,
        },
      },
      message: 'Version number does not match current head version.',
    };

    analyticsHelper.sendErrorEvent(
      stepRejectedError,
      'Meaningful Context-Aware Error Message',
    );

    await nextTick();

    expect(fakeAnalyticsWebClient.sendOperationalEvent).toHaveBeenCalledTimes(
      1,
    );
    expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith({
      action: 'error',
      actionSubject: 'collab',
      attributes: {
        packageName,
        packageVersion,
        collabService: 'ncs',
        network: {
          status: 'ONLINE',
        },
        documentAri: fakeDocumentAri,
        errorMessage: 'Meaningful Context-Aware Error Message',
      },
      nonPrivacySafeAttributes: {
        error: stepRejectedError,
      },
      tags: ['editor'],
      source: 'unknown',
    });
  });

  describe('when sendActionEvent is called', () => {
    let originalRequestIdleCallback: Function | undefined;
    beforeEach(() => {
      originalRequestIdleCallback = (window as any).requestIdleCallback;
      (window as any).requestIdleCallback = undefined;
    });

    afterEach(() => {
      (window.requestAnimationFrame as jest.Mock).mockRestore();
      (window as any).requestIdleCallback = originalRequestIdleCallback;
    });

    describe('and when requestIdleCallback is available', () => {
      let requestIdleCallbackMock: jest.Mock;
      beforeEach(() => {
        requestIdleCallbackMock = jest.fn();
        (window as any).requestIdleCallback = requestIdleCallbackMock;
      });

      it('should use this window function', () => {
        analyticsHelper.sendActionEvent(
          EVENT_ACTION.UPDATE_PARTICIPANTS,
          EVENT_STATUS.SUCCESS,
        );

        expect(requestIdleCallbackMock).toHaveBeenCalled();
      });

      it('should fire the analytics events', () => {
        requestIdleCallbackMock.mockImplementation((cb) => (cb as Function)());

        analyticsHelper.sendActionEvent(
          EVENT_ACTION.UPDATE_PARTICIPANTS,
          EVENT_STATUS.SUCCESS,
        );

        expect(
          fakeAnalyticsWebClient.sendOperationalEvent,
        ).toHaveBeenCalledTimes(1);
      });
    });

    describe('and when requestIdleCallback is not available', () => {
      it('should use the requestAnimationFrame', () => {
        analyticsHelper.sendActionEvent(
          EVENT_ACTION.UPDATE_PARTICIPANTS,
          EVENT_STATUS.SUCCESS,
        );
        expect(window.requestAnimationFrame).toHaveBeenCalled();
      });

      it('should fire the analytics events', () => {
        (window.requestAnimationFrame as jest.Mock).mockImplementation((cb) =>
          (cb as Function)(),
        );
        analyticsHelper.sendActionEvent(
          EVENT_ACTION.UPDATE_PARTICIPANTS,
          EVENT_STATUS.SUCCESS,
        );
        expect(
          fakeAnalyticsWebClient.sendOperationalEvent,
        ).toHaveBeenCalledTimes(1);
      });
    });
  });
});
