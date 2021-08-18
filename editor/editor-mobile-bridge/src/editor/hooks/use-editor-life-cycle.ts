import { useCallback, useEffect, useState } from 'react';
import {
  EditorActions,
  EditorProps,
  setMobilePaddingTop,
} from '@atlaskit/editor-core';
import { toNativeBridge } from '../web-to-native';
import WebBridgeImpl from '../native-to-web';

interface EditorLifecycle {
  handleEditorReady: (editorActions: EditorActions) => void;
  handleEditorDestroyed: () => void;
  editorReady: boolean;
}

export const useEditorLifecycle = (
  bridge: WebBridgeImpl,
  mediaOptions?: EditorProps['media'],
): EditorLifecycle => {
  const [editorReady, setEditorReady] = useState(false);

  // Keeping editor lifecycle not depending of bridge changes, only editor actions.
  useEffect(() => {
    if (!editorReady) {
      return;
    }

    toNativeBridge.editorReady();
    return () => {
      toNativeBridge.editorDestroyed();
    };
  }, [editorReady]);

  const handleEditorReady = useCallback(
    (editorActions: EditorActions) => {
      const mobilePaddingTop = bridge.getPadding().top;

      bridge.registerEditor(editorActions);

      const editorView = editorActions._privateGetEditorView();

      if (mediaOptions && mediaOptions.customMediaPicker) {
        bridge.mediaPicker = mediaOptions.customMediaPicker;
      }

      /**
       * Because native side calls `setPadding` in bridge implementation before editorView is created,
       * we need to dispatch the `setMobilePaddingTop` action again when the editor view is created,
       * in order to set the padding on the editor side for height calculations
       */
      if (editorView && mobilePaddingTop > 0) {
        setMobilePaddingTop(mobilePaddingTop)(
          editorView.state,
          editorView.dispatch,
        );
      }
      setEditorReady(true);
    },
    [bridge, mediaOptions],
  );

  const handleEditorDestroyed = useCallback(() => {
    bridge.unregisterEditor();
    setEditorReady(false);
    bridge.mentionsPluginState = null;
  }, [bridge]);

  return {
    handleEditorReady,
    handleEditorDestroyed,
    editorReady,
  };
};
