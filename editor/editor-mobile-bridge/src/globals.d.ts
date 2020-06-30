import RendererBridgeImpl from './renderer/native-to-web/implementation';
import WebBridgeImpl from './editor/native-to-web/implementation';
import {
  EditorBridges,
  EditorPluginBridges,
  PromiseBridge,
} from './editor/web-to-native/';
import {
  RendererBridges,
  RendererPluginBridges,
} from './renderer/web-to-native/bridge';
import { RuntimeBridges } from './error-reporter';

declare global {
  // Automatically de-duplicated set of editor/renderer bridges
  type CombinedBridgeNames =
    | EditorPluginBridges
    | RendererPluginBridges
    | keyof RuntimeBridges;

  // Android implementation is via extension
  interface Window extends EditorBridges, RendererBridges, RuntimeBridges {
    // Generic implementation is via these globals
    bridge?: WebBridgeImpl;
    rendererBridge?: RendererBridgeImpl;

    // Debugging object used for IS_DEV || IS_TEST
    logBridge?: any;

    // iOS implementation is via augmentation
    webkit?: {
      messageHandlers: {
        [key in CombinedBridgeNames]?: { postMessage: (payload: any) => void };
      };
    };
  }
}
