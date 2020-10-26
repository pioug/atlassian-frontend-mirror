import { useEffect } from 'react';
import WebBridgeImpl from '../native-to-web';
import { EditorProps } from '@atlaskit/editor-core';
import { Provider as CollabProvider } from '@atlaskit/collab-provider';

export function usePageTitle(
  bridge: WebBridgeImpl,
  collabEdit: EditorProps['collabEdit'] | undefined,
) {
  useEffect(() => {
    if (!collabEdit || !collabEdit.provider) {
      return;
    }

    const destroy = bridge.setupTitle(
      collabEdit.provider as Promise<CollabProvider>,
    );
    return () => {
      destroy();
    };
  }, [collabEdit, bridge]);
}
