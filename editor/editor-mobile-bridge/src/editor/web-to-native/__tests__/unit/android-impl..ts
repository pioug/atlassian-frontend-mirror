import AndroidBridge from '../../android-impl';

function createAndroidMockBridge(): [AndroidBridge, Window] {
  const mockWindow = ({
    lifecycleBridge: {
      editorReady: jest.fn(),
      editorDestroyed: jest.fn(),
    },
    analyticsBridge: { trackEvent: jest.fn() },
    blockFormatBridge: {
      updateBlockState: jest.fn(),
      updateText: jest.fn(),
      updateTextColor: jest.fn(),
      updateTextFormat: jest.fn(),
    },
    collabBridge: {
      emit: jest.fn(),
      disconnect: jest.fn(),
      connect: jest.fn(),
    },
    linkBridge: {
      currentSelection: jest.fn(),
    },
    listBridge: {
      updateListState: jest.fn(),
    },
    mediaBridge: {
      getCollection: jest.fn(),
      getServiceHost: jest.fn(),
    },
    mentionBridge: {
      dismissMentions: jest.fn(),
      showMentions: jest.fn(),
    },
    mentionsBridge: {
      dismissMentions: jest.fn(),
      showMentions: jest.fn(),
    },
    promiseBridge: {
      submitPromise: jest.fn(),
    },
    selectionBridge: {},
    statusBridge: {
      dismissStatusPicker: jest.fn(),
      showStatusPicker: jest.fn(),
    },
    textFormatBridge: {
      updateBlockState: jest.fn(),
      updateText: jest.fn(),
      updateTextColor: jest.fn(),
      updateTextFormat: jest.fn(),
    },
    typeAheadBridge: {
      dismissTypeAhead: jest.fn(),
      typeAheadDisplayItems: jest.fn(),
      typeAheadQuery: jest.fn(),
    },
    undoRedoBridge: {
      stateChanged: jest.fn(),
    },
  } as any) as Window;
  return [new AndroidBridge(mockWindow), mockWindow];
}
describe('Web To Native', () => {
  describe('Android', () => {
    let androidBridge: AndroidBridge;
    let windowWithMockBridges: Window;
    beforeEach(() => {
      [androidBridge, windowWithMockBridges] = createAndroidMockBridge();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('Lifecycle bridge', () => {
      it('should call native editorReady bridge method', function () {
        androidBridge.editorReady();

        expect(
          windowWithMockBridges.lifecycleBridge!.editorReady,
        ).toHaveBeenCalled();
      });

      it('should call native editorDestroyed method', function () {
        androidBridge.editorDestroyed();

        expect(
          windowWithMockBridges.lifecycleBridge!.editorDestroyed,
        ).toHaveBeenCalled();
      });

      it('should call native editorReady only once when method is called a second time', function () {
        androidBridge.editorReady();
        androidBridge.editorReady();

        expect(
          windowWithMockBridges.lifecycleBridge!.editorReady,
        ).toHaveBeenCalledTimes(1);
      });

      it('should send analytics event when editorReady is called twice', function () {
        androidBridge.editorReady();
        androidBridge.editorReady();

        expect(
          windowWithMockBridges.analyticsBridge!.trackEvent,
        ).toHaveBeenCalledWith(
          JSON.stringify({
            action: 'editorReadyCalledTwice',
            actionSubject: 'editor',
            eventType: 'operational',
          }),
        );
      });

      it('should not throw if lifeCycle bridge does not exist', function () {
        const androidBridge = new AndroidBridge(({
          lifecycleBridge: undefined,
          analyticsBridge: { trackEvent: jest.fn() },
        } as any) as Window);

        expect(() => androidBridge.editorReady()).not.toThrow();
      });

      it('should send analytics event when lifecycleBridge does not exist', function () {
        const analyticsBridge = { trackEvent: jest.fn() };
        const androidBridge = new AndroidBridge(({
          lifecycleBridge: undefined,
          analyticsBridge,
        } as any) as Window);

        androidBridge.editorReady();

        expect(analyticsBridge.trackEvent).toHaveBeenCalledWith(
          JSON.stringify({
            action: 'editorReadyCalledBeforeLifecycleBridgeSetup',
            actionSubject: 'editor',
            eventType: 'track',
          }),
        );
      });
    });
  });
});
