import IosBridge from '../../ios-impl';

function createiOSMockBridge(): [IosBridge, Window] {
  const webkit: Window['webkit'] = {
    messageHandlers: {
      lifecycleBridge: { postMessage: jest.fn() },
      undoRedoBridge: { postMessage: jest.fn() },
      typeAheadBridge: { postMessage: jest.fn() },
      textFormatBridge: { postMessage: jest.fn() },
      statusBridge: { postMessage: jest.fn() },
      selectionBridge: { postMessage: jest.fn() },
      promiseBridge: { postMessage: jest.fn() },
      mentionsBridge: { postMessage: jest.fn() },
      mentionBridge: { postMessage: jest.fn() },
      listBridge: { postMessage: jest.fn() },
      linkBridge: { postMessage: jest.fn() },
      collabBridge: { postMessage: jest.fn() },
      blockFormatBridge: { postMessage: jest.fn() },
      analyticsBridge: { postMessage: jest.fn() },
      annotationBridge: { postMessage: jest.fn() },
      errorBridge: { postMessage: jest.fn() },
      mediaBridge: { postMessage: jest.fn() },
      renderBridge: { postMessage: jest.fn() },
      taskDecisionBridge: { postMessage: jest.fn() },
      pageTitleBridge: { postMessage: jest.fn() },
    },
  };
  const mockWindow = ({
    webkit,
  } as any) as Window;
  return [new IosBridge(mockWindow), mockWindow];
}
describe('Web To Native', () => {
  describe('iOS', () => {
    let iosBridge: IosBridge;
    let windowWithMockBridges: Window;
    beforeEach(() => {
      [iosBridge, windowWithMockBridges] = createiOSMockBridge();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('Lifecycle bridge', () => {
      describe('editorReady', () => {
        it('should call native', function () {
          iosBridge.editorReady();

          expect(
            windowWithMockBridges.webkit!.messageHandlers.lifecycleBridge!
              .postMessage,
          ).toHaveBeenCalledWith({ name: 'editorReady' });
        });

        it('should call native only once when method is called a second time', function () {
          iosBridge.editorReady();
          iosBridge.editorReady();

          expect(
            windowWithMockBridges.webkit!.messageHandlers.lifecycleBridge!
              .postMessage,
          ).toHaveBeenNthCalledWith(1, { name: 'editorReady' });
        });

        it('should send analytics event called twice', function () {
          iosBridge.editorReady();
          iosBridge.editorReady();

          expect(
            windowWithMockBridges.webkit!.messageHandlers.analyticsBridge!
              .postMessage,
          ).toHaveBeenCalledWith({
            name: 'trackEvent',
            event: JSON.stringify({
              action: 'editorReadyCalledTwice',
              actionSubject: 'editor',
              eventType: 'operational',
            }),
          });
        });

        it('should not throw if lifeCycle bridge does not exist', function () {
          const iosBridge = new IosBridge(({
            webkit: {
              messageHandlers: {
                lifecycleBridge: undefined,
                analyticsBridge: { postMessage: jest.fn() },
              },
            },
          } as any) as Window);

          expect(() => iosBridge.editorReady()).not.toThrow();
        });

        it('should send analytics event when lifecycleBridge does not exist', function () {
          const analyticsBridge = { postMessage: jest.fn() };
          const iosBridge = new IosBridge(({
            webkit: {
              messageHandlers: {
                lifecycleBridge: undefined,
                analyticsBridge,
              },
            },
          } as any) as Window);

          iosBridge.editorReady();

          expect(analyticsBridge.postMessage).toHaveBeenCalledWith({
            name: 'trackEvent',
            event: JSON.stringify({
              action: 'editorReadyCalledBeforeLifecycleBridgeSetup',
              actionSubject: 'editor',
              eventType: 'track',
            }),
          });
        });
      });

      describe('startWebBundle', () => {
        it('should call native', function () {
          iosBridge.startWebBundle();

          expect(
            windowWithMockBridges.webkit!.messageHandlers.lifecycleBridge!
              .postMessage,
          ).toHaveBeenCalledWith({ name: 'startWebBundle' });
        });

        it('should call native only once when method is called a second time', function () {
          iosBridge.startWebBundle();
          iosBridge.startWebBundle();

          expect(
            windowWithMockBridges.webkit!.messageHandlers.lifecycleBridge!
              .postMessage,
          ).toHaveBeenNthCalledWith(1, { name: 'startWebBundle' });
        });

        it('should send analytics event called twice', function () {
          iosBridge.startWebBundle();
          iosBridge.startWebBundle();

          expect(
            windowWithMockBridges.webkit!.messageHandlers.analyticsBridge!
              .postMessage,
          ).toHaveBeenCalledWith({
            name: 'trackEvent',
            event: JSON.stringify({
              action: 'startWebBundleCalledTwice',
              actionSubject: 'editor',
              eventType: 'operational',
            }),
          });
        });

        it('should not throw if lifeCycle bridge does not exist', function () {
          const iosBridge = new IosBridge(({
            webkit: {
              messageHandlers: {
                lifecycleBridge: undefined,
                analyticsBridge: { postMessage: jest.fn() },
              },
            },
          } as any) as Window);

          expect(() => iosBridge.startWebBundle()).not.toThrow();
        });

        it('should send analytics event when lifecycleBridge does not exist', function () {
          const analyticsBridge = { postMessage: jest.fn() };
          const iosBridge = new IosBridge(({
            webkit: {
              messageHandlers: {
                lifecycleBridge: undefined,
                analyticsBridge,
              },
            },
          } as any) as Window);

          iosBridge.startWebBundle();

          expect(analyticsBridge.postMessage).toHaveBeenCalledWith({
            name: 'trackEvent',
            event: JSON.stringify({
              action: 'startWebBundleCalledBeforeLifecycleBridgeSetup',
              actionSubject: 'editor',
              eventType: 'track',
            }),
          });
        });
      });

      describe('editorError', () => {
        const errorString = new Error('TestError').toString();
        it('should call native', () => {
          iosBridge.editorError(errorString);

          expect(
            windowWithMockBridges.webkit!.messageHandlers.lifecycleBridge!
              .postMessage,
          ).toHaveBeenCalledWith({
            name: 'editorError',
            error: errorString,
            errorInfo: undefined,
          });
        });

        it('should send analytics on error with bridge', () => {
          iosBridge.editorError(errorString);

          expect(
            windowWithMockBridges.webkit!.messageHandlers.analyticsBridge!
              .postMessage,
          ).toHaveBeenCalledWith({
            name: 'trackEvent',
            event: JSON.stringify({
              action: 'editorError',
              actionSubject: 'editor',
              eventType: 'operational',
              attributes: {
                isBridgeSetup: true,
                errorMessage: 'Error: TestError',
              },
            }),
          });
        });

        it('should send analytics on error without bridge', () => {
          const analyticsBridge = { postMessage: jest.fn() };
          const iosBridge = new IosBridge(({
            webkit: {
              messageHandlers: {
                lifecycleBridge: undefined,
                analyticsBridge,
              },
            },
          } as any) as Window);

          iosBridge.editorError(errorString);

          expect(analyticsBridge.postMessage).toHaveBeenCalledWith({
            name: 'trackEvent',
            event: JSON.stringify({
              action: 'editorError',
              actionSubject: 'editor',
              eventType: 'operational',
              attributes: {
                isBridgeSetup: false,
                errorMessage: 'Error: TestError',
              },
            }),
          });
        });
      });

      it('should call native editorDestroyed method', function () {
        iosBridge.editorDestroyed();

        expect(
          windowWithMockBridges.webkit!.messageHandlers.lifecycleBridge!
            .postMessage,
        ).toHaveBeenCalledWith({ name: 'editorDestroyed' });
      });
    });

    describe('PageTitle bridge', () => {
      it('should call updateTitle in native', function () {
        const title = 'foo';
        iosBridge.updateTitle(title);

        expect(
          windowWithMockBridges.webkit?.messageHandlers.pageTitleBridge
            ?.postMessage,
        ).toHaveBeenCalledWith({
          name: 'updateTitle',
          title,
        });
      });
    });

    describe('TypeAhead bridge', () => {
      it('should call dismissTypeAhead in native', function () {
        iosBridge.dismissTypeAhead();

        expect(
          windowWithMockBridges.webkit?.messageHandlers.typeAheadBridge
            ?.postMessage,
        ).toHaveBeenCalledWith({
          name: 'dismissTypeAhead',
        });
      });
    });
  });
});
