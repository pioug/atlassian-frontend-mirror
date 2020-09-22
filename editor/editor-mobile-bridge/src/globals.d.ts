import RendererBridgeImpl from './renderer/native-to-web/implementation';
import WebBridgeImpl from './editor/native-to-web/implementation';
import { EditorBridges } from './editor/web-to-native/';
import { RendererBridges } from './renderer/web-to-native/bridge';
import { ErrorBridge, RuntimeBridges } from './error-reporter';

type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};

declare global {
  // Automatically de-duplicated set of editor/renderer bridge keys
  type CombinedBridgeNames =
    | keyof EditorBridges
    | keyof RendererBridges
    | keyof RuntimeBridges;

  type BridgeEventName<K extends CombinedBridgeNames> =
    | keyof Required<EditorBridges>[K]
    | keyof Required<RendererBridges>[K]
    | keyof Required<RuntimeBridges>[K];

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
    requestIdleCallback: (
      callback: (deadline: RequestIdleCallbackDeadline) => void,
      opts?: RequestIdleCallbackOptions,
    ) => RequestIdleCallbackHandle;
    cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
  }
}
