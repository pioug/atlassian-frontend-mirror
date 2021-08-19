import { useEffect } from 'react';
import WebBridgeImpl from '../native-to-web';
import EditorConfiguration from '../editor-configuration';
import { configFactory, initPluginListeners } from '../plugin-subscription';

export function usePluginListeners(
  editorReady: boolean,
  editorConfiguration: EditorConfiguration,
  bridge: WebBridgeImpl,
) {
  useEffect(() => {
    if (!editorReady) {
      return;
    }

    const eventDispatcher = bridge.editorActions._privateGetEventDispatcher()!;
    const editorView = bridge.editorActions._privateGetEditorView()!;
    const configs = configFactory(editorConfiguration);

    return initPluginListeners(configs)(eventDispatcher, bridge, editorView);
  }, [bridge, editorConfiguration, editorReady]);
}
