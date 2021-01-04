import WebBridgeImpl from './implementation';
import EditorConfiguration from '../editor-configuration';

export const getBridge = (config?: EditorConfiguration): WebBridgeImpl => {
  if (!window.bridge) {
    let bridge: WebBridgeImpl = new WebBridgeImpl(config);
    window.bridge = bridge;
    return bridge;
  } else {
    return window.bridge;
  }
};
