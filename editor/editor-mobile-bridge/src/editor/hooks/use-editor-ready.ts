import { useCallback } from 'react';
import { EditorView } from 'prosemirror-view';

import { EditorActions } from '@atlaskit/editor-core';
import {
  EditorProps,
  processQuickInsertItems,
  quickInsertPluginKey,
  setMobilePaddingTop,
} from '@atlaskit/editor-core';
import { EditorViewWithComposition } from '../../types';
import { initPluginListeners } from '../plugin-subscription';
import WebBridgeImpl from '../native-to-web';
import { InjectedIntl } from 'react-intl';

import { getEnableQuickInsertValue } from '../../query-param-reader';
import { toNativeBridge } from '../web-to-native';

export function useEditorReady(
  bridge: WebBridgeImpl,
  mediaOptions?: EditorProps['media'],
): (editorActions: EditorActions) => void {
  return useCallback(
    (editorActions: EditorActions) => {
      const mobilePaddingTop = bridge.getPadding().top;

      // At this point editor view event dispatcher always exist...
      // Add a checker to throw or register some event to prevent future errors
      const eventDispatcher = editorActions._privateGetEventDispatcher();
      const editorView = editorActions._privateGetEditorView();

      if (!eventDispatcher || !editorView) {
        throw new Error(
          'Editor lifecycle has changed. EditorView and EventDispatcher are no longer available on EditorReady event',
        );
      }

      bridge.editorView = editorView as EditorView & EditorViewWithComposition;
      bridge.editorActions._privateRegisterEditor(
        bridge.editorView,
        eventDispatcher,
      );

      if (mediaOptions && mediaOptions.customMediaPicker) {
        bridge.mediaPicker = mediaOptions.customMediaPicker;
      }

      initPluginListeners(eventDispatcher, bridge, bridge.editorView);

      if (getEnableQuickInsertValue()) {
        const quickInsertPluginState = quickInsertPluginKey.getState(
          bridge.editorView.state,
        );
        bridge.quickInsertItems.resolve(
          processQuickInsertItems(
            quickInsertPluginState.lazyDefaultItems(),
            {
              formatMessage: messageDescriptor =>
                messageDescriptor && messageDescriptor.defaultMessage,
            } as InjectedIntl, // TWISTA-4 This was broken already, it needs to wait for IntlProvider to get set up (PR after editorReady event get implemented)
          ),
        );
      }
      /**
       * Because native side calls `setPadding` in bridge implementation before editorView is created,
       * we need to dispatch the `setMobilePaddingTop` action again when the editor view is created,
       * in order to set the padding on the editor side for height calculations
       */
      if (mobilePaddingTop > 0) {
        setMobilePaddingTop(mobilePaddingTop)(
          bridge.editorView.state,
          bridge.editorView.dispatch,
        );
      }
      toNativeBridge.editorReady();
    },
    [bridge, mediaOptions],
  );
}
