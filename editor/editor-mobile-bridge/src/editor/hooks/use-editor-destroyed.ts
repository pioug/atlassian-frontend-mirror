import { useCallback } from 'react';

import { destroyPluginListeners } from '../plugin-subscription';
import WebBridgeImpl from '../native-to-web';

export function useEditorDestroyed(bridge: WebBridgeImpl): () => void {
  return useCallback(() => {
    const eventDispatcher = bridge.editorActions._privateGetEventDispatcher();
    if (eventDispatcher) {
      destroyPluginListeners(eventDispatcher, bridge);
    }

    bridge.editorActions._privateUnregisterEditor();
    bridge.editorView = null;
    bridge.mentionsPluginState = null;
  }, [bridge]);
}
