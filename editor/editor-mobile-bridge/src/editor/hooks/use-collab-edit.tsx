import { useEffect, useMemo } from 'react';
import WebBridgeImpl from '../native-to-web';
import { Provider as CollabProvider } from '@atlaskit/collab-provider';
import { useCollabProvider } from '../../providers/collab-provider';
import { EditorProps } from '@atlaskit/editor-core';
import EditorConfiguration from '../../editor/editor-configuration';

export function useCollabEdit(
  bridge: WebBridgeImpl,
  configuration: EditorConfiguration,
  createCollabProvider: (bridge: WebBridgeImpl) => Promise<CollabProvider>,
): EditorProps['collabEdit'] | undefined {
  const collabProvider = useCollabProvider(
    bridge,
    configuration,
    createCollabProvider,
  );

  useEffect(() => {
    bridge.setCollabProviderPromise(collabProvider);
  }, [bridge, collabProvider]);

  return useMemo(() => {
    return collabProvider
      ? {
          useNativePlugin: true,
          provider: collabProvider,
        }
      : undefined;
  }, [collabProvider]);
}
