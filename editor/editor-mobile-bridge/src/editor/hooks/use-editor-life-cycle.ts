import { useCallback, useEffect, useState } from 'react';
import type { EditorActions, EditorProps } from '@atlaskit/editor-core';
import { setMobilePaddingTop } from '@atlaskit/editor-core/src/plugins/mobile-dimensions/commands';
import { toNativeBridge } from '../web-to-native';
import type WebBridgeImpl from '../native-to-web';
import { MediaClient } from '@atlaskit/media-client';
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

      if (!!mediaOptions?.customMediaPicker) {
        bridge.mediaPicker = mediaOptions.customMediaPicker; // deprecating
        bridge.media.mediaPicker = mediaOptions.customMediaPicker;
      }

      if (!!mediaOptions?.provider) {
        bridge.media.mediaUpload = mediaOptions.provider.then((provider) => {
          if (!provider?.uploadMediaClientConfig) {
            return;
          }
          const mediaClient = new MediaClient(provider.uploadMediaClientConfig);
          return mediaClient.mobileUploadPromise();
        });
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
