import { AnnotationBridge, AnnotationPayloadsByType } from './bridge';
import { sendToBridge } from '../../bridge-utils';

class WebRendererBridge {
  call = sendToBridge;
}

class Bridge implements AnnotationBridge {
  onAnnotationClick(annotationClickPayload?: AnnotationPayloadsByType[]) {
    if (annotationClickPayload) {
      sendToBridge('annotationBridge', 'onAnnotationClick', {
        payload: JSON.stringify(annotationClickPayload),
      });
    } else {
      sendToBridge('annotationBridge', 'onAnnotationClick');
    }
  }
}

export const toNativeBridge = new WebRendererBridge();
export const nativeBridgeAPI = new Bridge();
