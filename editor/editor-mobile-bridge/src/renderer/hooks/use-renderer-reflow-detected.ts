import { useLayoutEffect } from 'react';
import { toNativeBridge } from '../web-to-native/implementation';
import { DocumentReflowDetector } from '../../document-reflow-detector';
import { eventDispatcher, EmitterEvents } from '../dispatcher';
import RendererBridge from '../../renderer/native-to-web/implementation';

export function useRendererReflowDetected(bridge: RendererBridge) {
  useLayoutEffect(() => {
    const sendHeight = (height: number) => {
      toNativeBridge.call('renderBridge', 'onRenderedContentHeightChanged', {
        height,
      });
    };
    const reflowDetector = new DocumentReflowDetector({
      onReflow: sendHeight,
    });

    const reflowCallBack = (enabled?: boolean) => {
      if (enabled) {
        reflowDetector.enable(bridge.getRootElement());
      } else {
        reflowDetector.disable();
      }
    };

    eventDispatcher.on(
      EmitterEvents.SET_DOCUMENT_REFLOW_DETECTOR_STATUS,
      reflowCallBack,
    );

    return () => {
      reflowDetector.disable();
      eventDispatcher.off(
        EmitterEvents.SET_DOCUMENT_REFLOW_DETECTOR_STATUS,
        reflowCallBack,
      );
    };
  }, [bridge]);
}
