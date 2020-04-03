import { sendToBridge } from '../../bridge-utils';

class WebRendererBridge {
  call = sendToBridge;
}

export const toNativeBridge = new WebRendererBridge();
