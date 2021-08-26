import { useEffect } from 'react';
import WebBridgeImpl from '../native-to-web';
import { EditorProps } from '@atlaskit/editor-core';

export function usePageTitle(
  bridge: WebBridgeImpl,
  collabEdit: EditorProps['collabEdit'] | undefined,
) {
  useEffect(() => {
    if (!collabEdit || !collabEdit.provider) {
      return;
    }

    const destroy = bridge.setupTitle();
    return () => {
      destroy();
    };
  }, [collabEdit, bridge]);
}
