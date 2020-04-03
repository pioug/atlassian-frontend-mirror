import RendererBridgeImpl from './renderer/native-to-web/implementation';
import WebBridgeImpl from './editor/native-to-web/implementation';

declare global {
  interface Window {
    bridge?: WebBridgeImpl;
    rendererBridge?: RendererBridgeImpl;
  }
}
