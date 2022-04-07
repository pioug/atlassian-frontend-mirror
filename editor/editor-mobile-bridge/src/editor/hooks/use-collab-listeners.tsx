import { useEffect } from 'react';
import WebBridgeImpl from '../native-to-web';
import {
  Provider as CollabProvider,
  CollabMetadataPayload,
  CollabErrorPayload,
} from '@atlaskit/collab-provider';
import { toNativeBridge } from '../web-to-native';

export function useCollabListeners(
  bridge: WebBridgeImpl,
  collabEdit: { provider: Promise<CollabProvider> } | undefined,
) {
  useEffect(() => {
    if (!collabEdit || !collabEdit.provider) {
      return;
    }

    const onMetadataChange = (payload: CollabMetadataPayload) => {
      const { title } = payload;
      if (title) {
        toNativeBridge.updateTitle(title as string);
      }
    };

    const onError = (payload: CollabErrorPayload) => {
      toNativeBridge.onCollabError(
        payload.message,
        payload.status,
        payload.code,
      );
    };

    const setupPromise = collabEdit.provider.then((provider) => {
      provider.on('metadata:changed', onMetadataChange);
      provider.on('error', onError);

      return () => {
        provider.off('metadata:changed', onMetadataChange);
        provider.off('error', onError);
      };
    });

    return () => {
      setupPromise.then((destroy) => destroy());
    };
  }, [collabEdit, bridge]);
}
