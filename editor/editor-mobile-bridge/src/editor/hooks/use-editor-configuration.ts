import { useEffect, useState, useCallback } from 'react';
import EditorConfiguration from '../editor-configuration';
import WebBridgeImpl from '../native-to-web';

export function useEditorConfiguration(
  bridge: WebBridgeImpl,
  config?: EditorConfiguration,
): EditorConfiguration {
  const [editorConfiguration, setEditorConfiguration] = useState(
    config || new EditorConfiguration(),
  );

  const handleEditorConfigUpdate = useCallback(
    (editorConfig: EditorConfiguration) => {
      setEditorConfiguration(editorConfig);
    },
    [setEditorConfiguration],
  );

  useEffect(() => {
    bridge.setEditorConfigChangeHandler(handleEditorConfigUpdate);
    bridge.setEditorConfiguration(editorConfiguration);
  }, [bridge, editorConfiguration, handleEditorConfigUpdate]);

  return editorConfiguration;
}
