import { useEffect } from 'react';
import WebBridgeImpl from '../native-to-web';
import EditorConfiguration from '../editor-configuration';
import { InjectedIntl } from 'react-intl';
import {
  StatusType,
  subscribeToToolbarAndPickerUpdates,
} from '@atlaskit/editor-core';
import { createFloatingToolbarConfigForStatus } from '../status-utils';
import { createFloatingToolbarConfigForDate } from '../date-utils';

export function useToolbarSubscription(
  editorReady: boolean,
  editorConfiguration: EditorConfiguration,
  bridge: WebBridgeImpl,
  intl: InjectedIntl,
) {
  useEffect(() => {
    if (!editorReady) {
      return;
    }

    const editorView = bridge.editorActions._privateGetEditorView()!;

    const unsubscribeFromToolbarAndPickerUpdates = subscribeToToolbarAndPickerUpdates(
      editorView,
      ({ dateState, statusState, toolbarConfig }) => {
        if (dateState.showDatePickerAt) {
          const node = editorView.state.doc.nodeAt(dateState.showDatePickerAt);
          if (!node) {
            return;
          }

          const config = createFloatingToolbarConfigForDate(node, intl);
          bridge.mobileEditingToolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
            config,
            node,
          );
        } else if (statusState.showStatusPickerAt) {
          const node = editorView.state.doc.nodeAt(
            statusState.showStatusPickerAt,
          );
          if (!node) {
            return;
          }

          const config = createFloatingToolbarConfigForStatus(
            node.attrs as StatusType,
            node.type,
            statusState.showStatusPickerAt,
            (config) =>
              bridge.mobileEditingToolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
                config,
              ),
            editorConfiguration,
            intl,
          );

          bridge.mobileEditingToolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
            config,
            node,
          );
        } else if (toolbarConfig && toolbarConfig.config) {
          bridge.mobileEditingToolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
            toolbarConfig.config,
            toolbarConfig.node,
          );
        } else {
          bridge.mobileEditingToolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
            undefined,
            null,
          );
        }
      },
    );

    return () => {
      unsubscribeFromToolbarAndPickerUpdates();
    };
  }, [bridge, editorConfiguration, editorReady, intl]);
}
