import WebBridgeImpl from './implementation';

export const getBridge = (): WebBridgeImpl => {
  if (!window.bridge) {
    let bridge: WebBridgeImpl = new WebBridgeImpl();
    window.bridge = bridge;
    return bridge;
  } else {
    return window.bridge;
  }
};
