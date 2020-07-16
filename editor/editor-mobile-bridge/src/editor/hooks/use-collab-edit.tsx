import React from 'react';
import WebBridgeImpl from '../native-to-web';
import { Provider as CollabProvider } from '@atlaskit/collab-provider';
import { useCollabProvider } from '../../providers/collab-provider';
import { EditorProps } from '@atlaskit/editor-core';

export function useCollabEdit(
  bridge: WebBridgeImpl,
  createCollabProvider: (bridge: WebBridgeImpl) => Promise<CollabProvider>,
): EditorProps['collabEdit'] | undefined {
  const collabProvider = useCollabProvider(bridge, createCollabProvider);

  return React.useMemo(() => {
    return collabProvider
      ? {
          useNativePlugin: true,
          provider: collabProvider,
        }
      : undefined;
  }, [collabProvider]);
}
