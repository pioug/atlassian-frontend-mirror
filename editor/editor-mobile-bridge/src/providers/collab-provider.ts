import React from 'react';
import { Provider as CollabProvider, Socket } from '@atlaskit/collab-provider';
import WebBridgeImpl from '../editor/native-to-web';
import { createPromise } from '../cross-platform-promise';
import { FetchProxy } from '../utils/fetch-proxy';
import { Storage } from '@atlaskit/collab-provider/types';
import EditorConfiguration from '../editor/editor-configuration';
import { getAllowCollabProvider } from '../query-param-reader';

export class StorageImpl implements Storage {
  delete(key: string): Promise<void> {
    return createPromise('deleteStorageValue', { key }).submit();
  }

  get(key: string): Promise<string> {
    return createPromise('getStorageValue', { key }).submit();
  }

  set(key: string, value: string): Promise<void> {
    return createPromise('setStorageValue', { key, value }).submit();
  }
}

export function createCollabProviderFactory(fetchProxy: FetchProxy) {
  return async (bridge: WebBridgeImpl) => {
    const { documentAri, baseUrl } = await createPromise(
      'getCollabConfig',
    ).submit();

    if (window.webkit) {
      fetchProxy.add(baseUrl);
    }

    return new CollabProvider({
      documentAri,
      url: baseUrl,
      lifecycle: bridge.lifecycle,
      storage: new StorageImpl(),

      createSocket(path: string): Socket {
        return bridge.createCollabSocket(path);
      },
    });
  };
}

export function useCollabProvider(
  bridge: WebBridgeImpl,
  configuration: EditorConfiguration,
  createCollabProvider?: (bridge: WebBridgeImpl) => Promise<CollabProvider>,
) {
  return React.useMemo(() => {
    // Backwards compatibility with passing it as a url param
    if (
      createCollabProvider &&
      (configuration.isCollabProviderEnabled() || getAllowCollabProvider())
    ) {
      return createCollabProvider(bridge);
    }
    return undefined;
  }, [createCollabProvider, bridge, configuration]);
}
