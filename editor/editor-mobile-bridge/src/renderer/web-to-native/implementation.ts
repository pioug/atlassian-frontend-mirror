import { AnnotationBridge, AnnotationPayloadsByType } from './bridge';
import { sendToBridge } from '../../bridge-utils';

class WebRendererBridge {
  call = sendToBridge;
}

class Bridge implements AnnotationBridge {
  onAnnotationClick(annotations?: AnnotationPayloadsByType[]) {
    if (annotations) {
      sendToBridge('annotationBridge', 'onAnnotationClick', {
        payload: JSON.stringify(annotations),
      });
    } else {
      sendToBridge('annotationBridge', 'onAnnotationClick');
    }
  }

  fetchAnnotationStates(annotations: AnnotationPayloadsByType[]) {
    sendToBridge('annotationBridge', 'fetchAnnotationStates', {
      payload: JSON.stringify(annotations),
    });
  }
}

export const toNativeBridge = new WebRendererBridge();
export const nativeBridgeAPI = new Bridge();
