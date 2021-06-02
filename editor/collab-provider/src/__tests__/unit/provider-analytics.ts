import { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { createSocketIOCollabProvider } from '../../socket-io-provider';
import type { Provider, CollabErrorPayload } from '../../provider';

describe('#fireAnalyticsEvent', () => {
  const stepRejectedError: CollabErrorPayload = {
    status: 409,
    code: 'HEAD_VERSION_UPDATE_FAILED',
    meta: 'The version number does not match the current head version.',
    message: 'Version number does not match current head version.',
  };
  let fakeAnalyticsWebClient: AnalyticsWebClient;
  let provider: Provider;

  beforeEach(() => {
    fakeAnalyticsWebClient = {
      sendOperationalEvent: jest.fn(),
      sendScreenEvent: jest.fn(),
      sendTrackEvent: jest.fn(),
      sendUIEvent: jest.fn(),
    };
    const testProviderConfigWithAnalytics = {
      url: `http://provider-url:66661`,
      documentAri: 'ari:cloud:confluence:ABC:page/testpage',
      analyticsClient: fakeAnalyticsWebClient,
    };
    provider = createSocketIOCollabProvider(testProviderConfigWithAnalytics);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when fireAnalyticsEvent is called', () => {
    let originalRequestIdleCallback: Function | undefined;
    beforeEach(() => {
      jest.spyOn(window, 'requestAnimationFrame');
      originalRequestIdleCallback = (window as any).requestIdleCallback;
      (window as any).requestIdleCallback = undefined;
    });

    afterEach(() => {
      (window.requestAnimationFrame as jest.Mock).mockRestore();
      (window as any).requestIdleCallback = originalRequestIdleCallback;
    });

    describe('when analytics payload is missing information', () => {
      beforeEach(() => {
        (window.requestAnimationFrame as jest.Mock).mockImplementation((cb) =>
          (cb as Function)(),
        );
      });

      it('should preserve original values', () => {
        (provider as any).fireAnalyticsEvent({
          action: 'nothing',
          source: 'neverland',
        });

        expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith(
          expect.objectContaining({ action: 'nothing', source: 'neverland' }),
        );
      });

      it('should add "collab" action as default', () => {
        (provider as any).fireAnalyticsEvent({ lol: 12 });

        expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith(
          expect.objectContaining({ action: 'collab' }),
        );
      });

      it('should add "unknown" source as default', () => {
        (provider as any).fireAnalyticsEvent({ lol: 12 });

        expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledWith(
          expect.objectContaining({ source: 'unknown' }),
        );
      });
    });

    describe('and when requestIdleCallback is available', () => {
      let requestIdleCallbackMock: jest.Mock;
      beforeEach(() => {
        requestIdleCallbackMock = jest.fn();
        (window as any).requestIdleCallback = requestIdleCallbackMock;
      });

      it('should use this window function', () => {
        (provider as any).onErrorHandled(stepRejectedError);
        expect(requestIdleCallbackMock).toHaveBeenCalled();
      });

      it('should fire the analytics events', () => {
        requestIdleCallbackMock.mockImplementation((cb) => (cb as Function)());

        (provider as any).onErrorHandled(stepRejectedError);
        expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledTimes(1);
      });
    });

    describe('and when requestIdleCallback is not available', () => {
      it('should use the requestAnimationFrame', () => {
        (provider as any).onErrorHandled(stepRejectedError);
        expect(window.requestAnimationFrame).toHaveBeenCalled();
      });

      it('should fire the analytics events', () => {
        (window.requestAnimationFrame as jest.Mock).mockImplementation((cb) =>
          (cb as Function)(),
        );
        (provider as any).onErrorHandled(stepRejectedError);
        expect(fakeAnalyticsWebClient.sendOperationalEvent).toBeCalledTimes(1);
      });
    });
  });
});
