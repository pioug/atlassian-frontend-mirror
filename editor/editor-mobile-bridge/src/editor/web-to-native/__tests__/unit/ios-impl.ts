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
      it('should call native editorReady bridge method', function() {
        iosBridge.editorReady();

        expect(
          windowWithMockBridges.webkit!.messageHandlers.lifecycleBridge!
            .postMessage,
        ).toHaveBeenCalledWith({ name: 'editorReady' });
      });

      it('should call native editorDestroyed method', function() {
        iosBridge.editorDestroyed();

        expect(
          windowWithMockBridges.webkit!.messageHandlers.lifecycleBridge!
            .postMessage,
        ).toHaveBeenCalledWith({ name: 'editorDestroyed' });
      });

      it('should call native editorReady only once when method is called a second time', function() {
        iosBridge.editorReady();
        iosBridge.editorReady();

        expect(
          windowWithMockBridges.webkit!.messageHandlers.lifecycleBridge!
            .postMessage,
        ).toHaveBeenNthCalledWith(1, { name: 'editorReady' });
      });

      it('should send analytics event when editorReady is called twice', function() {
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

      it('should not throw if lifeCycle bridge does not exist', function() {
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

      it('should send analytics event when lifecycleBridge does not exist', function() {
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
  });
});
