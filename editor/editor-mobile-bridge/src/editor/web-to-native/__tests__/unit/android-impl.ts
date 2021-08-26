import AndroidBridge from '../../android-impl';

function createAndroidMockBridge(): [AndroidBridge, Window] {
  const mockWindow = ({
    lifecycleBridge: {
      editorReady: jest.fn(),
      editorDestroyed: jest.fn(),
      startWebBundle: jest.fn(),
      editorError: jest.fn(),
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
      updateStepVersion: jest.fn(),
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
    pageTitleBridge: {
      updateTitle: jest.fn(),
    },
    contentBridge: {
      onContentRendered: jest.fn(),
    },
    toolbarBridge: {
      onNodeSelected: jest.fn(),
      onNodeDeselected: jest.fn(),
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
      describe('editorReady', () => {
        it('should call native', function () {
          androidBridge.editorReady();
          expect(
            windowWithMockBridges.lifecycleBridge!.editorReady,
          ).toHaveBeenCalled();
        });

        it('should call native only once when method is called a second time', function () {
          androidBridge.editorReady();
          androidBridge.editorReady();

          expect(
            windowWithMockBridges.lifecycleBridge!.editorReady,
          ).toHaveBeenCalledTimes(1);
        });

        it('should send analytics event called twice', function () {
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

      describe('startWebBundle', () => {
        it('should call native', function () {
          androidBridge.startWebBundle();
          expect(
            windowWithMockBridges.lifecycleBridge!.startWebBundle,
          ).toHaveBeenCalled();
        });

        it('should call native only once when method is called a second time', function () {
          androidBridge.startWebBundle();
          androidBridge.startWebBundle();

          expect(
            windowWithMockBridges.lifecycleBridge!.startWebBundle,
          ).toHaveBeenCalledTimes(1);
        });

        it('should send analytics event called twice', function () {
          androidBridge.startWebBundle();
          androidBridge.startWebBundle();

          expect(
            windowWithMockBridges.analyticsBridge!.trackEvent,
          ).toHaveBeenCalledWith(
            JSON.stringify({
              action: 'startWebBundleCalledTwice',
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

          expect(() => androidBridge.startWebBundle()).not.toThrow();
        });

        it('should send analytics event when lifecycleBridge does not exist', function () {
          const analyticsBridge = { trackEvent: jest.fn() };
          const androidBridge = new AndroidBridge(({
            lifecycleBridge: undefined,
            analyticsBridge,
          } as any) as Window);

          androidBridge.startWebBundle();

          expect(analyticsBridge.trackEvent).toHaveBeenCalledWith(
            JSON.stringify({
              action: 'startWebBundleCalledBeforeLifecycleBridgeSetup',
              actionSubject: 'editor',
              eventType: 'track',
            }),
          );
        });
      });

      describe('editorError', () => {
        const errorString = new Error('TestError').toString();
        it('should call native', () => {
          androidBridge.editorError(errorString);

          expect(
            windowWithMockBridges.lifecycleBridge!.editorError,
          ).toHaveBeenCalledWith(errorString, undefined);
        });

        it('should send analytics on error with bridge', () => {
          androidBridge.editorError(errorString);

          expect(
            windowWithMockBridges.analyticsBridge!.trackEvent,
          ).toHaveBeenCalledWith(
            JSON.stringify({
              action: 'editorError',
              actionSubject: 'editor',
              eventType: 'operational',
              attributes: {
                isBridgeSetup: true,
                errorMessage: 'Error: TestError',
              },
            }),
          );
        });

        it('should send analytics on error without bridge', () => {
          const analyticsBridge = { trackEvent: jest.fn() };
          const androidBridge = new AndroidBridge(({
            lifecycleBridge: undefined,
            analyticsBridge,
          } as any) as Window);

          androidBridge.editorError(errorString);

          expect(analyticsBridge.trackEvent).toHaveBeenCalledWith(
            JSON.stringify({
              action: 'editorError',
              actionSubject: 'editor',
              eventType: 'operational',
              attributes: {
                isBridgeSetup: false,
                errorMessage: 'Error: TestError',
              },
            }),
          );
        });
      });

      it('should call native editorDestroyed method', function () {
        androidBridge.editorDestroyed();

        expect(
          windowWithMockBridges.lifecycleBridge!.editorDestroyed,
        ).toHaveBeenCalled();
      });
    });

    describe('PageTitle Bridge', () => {
      it('should call updateTitle in native', function () {
        const title = 'foo';
        androidBridge.updateTitle(title);
        expect(
          windowWithMockBridges.pageTitleBridge!.updateTitle,
        ).toHaveBeenCalledWith(title);
      });
    });

    describe('TypeAhead Bridge', () => {
      it('should call dismissTypeAhead in native', function () {
        androidBridge.dismissTypeAhead();
        expect(
          windowWithMockBridges.typeAheadBridge!.dismissTypeAhead,
        ).toHaveBeenCalled();
      });
    });

    describe('Content Bridge', () => {
      it('should call onContentRendered in native', function () {
        const totalNodeSize = 100;
        const nodes = 'dummy nodes';
        const actualRenderingDuration = 1000;
        const totalBridgeDuration = 1100;

        androidBridge.onContentRendered(
          totalNodeSize,
          nodes,
          actualRenderingDuration,
          totalBridgeDuration,
        );

        expect(
          windowWithMockBridges.contentBridge!.onContentRendered,
        ).toHaveBeenCalledWith(
          totalNodeSize,
          nodes,
          actualRenderingDuration,
          totalBridgeDuration,
        );
      });
    });

    describe('Toolbar Bridge', () => {
      it('should call onNodeSelected in native', () => {
        androidBridge.onNodeSelected('panel', 'items');

        expect(
          windowWithMockBridges.toolbarBridge!.onNodeSelected,
        ).toBeCalledWith('panel', 'items');
      });

      it('should call onNodeDeselected in native', () => {
        androidBridge.onNodeDeselected();

        expect(
          windowWithMockBridges.toolbarBridge!.onNodeDeselected,
        ).toBeCalled();
      });
    });

    describe('Collab Bridge', () => {
      it('should call updateStepVersion in with version', () => {
        androidBridge.updateStepVersion(100);

        expect(
          windowWithMockBridges.collabBridge?.updateStepVersion,
        ).toBeCalledWith(100, undefined);
      });

      it('should call updateStepVersion in with error', () => {
        androidBridge.updateStepVersion(undefined, 'Error');

        expect(
          windowWithMockBridges.collabBridge?.updateStepVersion,
        ).toBeCalledWith(undefined, 'Error');
      });
    });
  });
});
