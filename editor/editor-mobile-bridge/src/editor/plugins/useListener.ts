import type { DependencyList } from 'react';
import { useRef, useEffect } from 'react';
import type WebBridgeImpl from '../native-to-web';

interface BridgeConfig<Key extends keyof WebBridgeImpl> {
  bridge: WebBridgeImpl;
  key: Key;
  state: WebBridgeImpl[Key];
}

/**
 *
 * The `useListener` hook is a substitute for `plugin-subscription`.
 *
 * The callback here should match what occurs in the `updater` the `createListenerConfig`.
 * The `createListenerConfig` under the hood also updates the state on the bridge object.
 * To do that here supply the `bridge` as well as the `key` and `state` to update in the
 * `bridgeConfig` parameter of this hook.
 *
 * If there is no matching state to update on the bridge object this third parameter
 * can be `undefined.
 *
 * @param cb Callback on change of the state
 * @param dependencies Dependencies to cause a re-run of the callback
 * @param bridgeConfig Contains the bridge as well as the key and state to update.
 */
export function useListener<Key extends keyof WebBridgeImpl>(
  cb: () => (() => void) | void,
  dependencies: DependencyList,
  bridgeConfig: BridgeConfig<Key> | undefined,
) {
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    if (bridgeConfig) {
      bridgeConfig.bridge[bridgeConfig.key] = {
        ...bridgeConfig.bridge[bridgeConfig.key],
        ...bridgeConfig.state,
      };
    }

    return cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
