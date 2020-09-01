import { useEffect } from 'react';
import { EventTypes } from '../event-dispatch';
import { toNativeBridge } from '../web-to-native';
import { DocumentReflowDetector } from '../../document-reflow-detector';
import WebBridgeImpl from '../native-to-web';

const reflowDetector = new DocumentReflowDetector({
  onReflow: (height: number) => {
    toNativeBridge.onRenderedContentHeightChanged(height);
  },
});

export const useReflowDectector = (bridge: WebBridgeImpl) => {
  useEffect(() => {
    const reflowCallBackEnable = (enabled: boolean): void => {
      if (!bridge.editorView) {
        return;
      }

      if (enabled && bridge.editorView.dom) {
        reflowDetector.enable(bridge.getRootElement());
      } else {
        reflowDetector.disable();
      }
    };

    bridge.eventEmitter.on(
      EventTypes.SET_DOCUMENT_REFLOW_DETECTOR_STATUS,
      reflowCallBackEnable,
    );

    return () => {
      bridge.eventEmitter.off(
        EventTypes.SET_DOCUMENT_REFLOW_DETECTOR_STATUS,
        reflowCallBackEnable,
      );
    };
  }, [bridge, bridge.editorView, bridge.eventEmitter]);
};
