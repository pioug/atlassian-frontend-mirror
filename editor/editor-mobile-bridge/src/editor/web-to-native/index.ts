import AndroidBridge from './android-impl';
import IosBridge from './ios-impl';
import DummyBridge from './dummy-impl';
import NativeBridge from './bridge';
import { IS_DEV, IS_TEST, IS_ATLASKIT } from '../../utils';

export type { EditorBridges, EditorBridgeNames } from './bridge';

function getBridgeImpl(): NativeBridge {
  if (window.promiseBridge) {
    return new AndroidBridge();
  } else if (window.webkit) {
    return new IosBridge();
  } else if (IS_DEV || IS_TEST || IS_ATLASKIT) {
    return new DummyBridge();
  } else {
    throw new Error(
      `Not mounted on mobile devices or in development mode, no bridge available`,
    );
  }
}

export const toNativeBridge: NativeBridge = getBridgeImpl();
