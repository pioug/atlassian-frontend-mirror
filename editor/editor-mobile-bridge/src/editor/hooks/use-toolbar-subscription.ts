import { useEffect } from 'react';
import type WebBridgeImpl from '../native-to-web';
import type EditorConfiguration from '../editor-configuration';
import type { IntlShape } from 'react-intl-next';
import type { StatusType } from '@atlaskit/editor-core/src/plugins/status/plugin';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { subscribeToToolbarAndPickerUpdates } from '@atlaskit/editor-core/src/plugins/view-update-subscription/subscribe/toolbarAndPickerUpdates';
import { createFloatingToolbarConfigForStatus } from '../status-utils';
import { createFloatingToolbarConfigForDate } from '../date-utils';
import { isPanelNode } from '@atlaskit/editor-core/src/plugins/paste/util';
import { createFloatingToolbarConfigForPanel } from '../panel-utils';

// Copied from: @atlaskit/editor-plugin-media/src/utils/media-single
function isCaptionNode(editorView: EditorView) {
  const { $from } = editorView.state.selection;
  const immediateWrapperParentNode = editorView.state.doc.nodeAt(
    $from.before(Math.max($from.depth, 1)),
  );
  if (
    immediateWrapperParentNode &&
    immediateWrapperParentNode.type.name === 'caption'
  ) {
    return true;
  }
  return false;
}

export function useToolbarSubscription(
  editorReady: boolean,
  editorConfiguration: EditorConfiguration,
  bridge: WebBridgeImpl,
  intl: IntlShape,
) {
  useEffect(() => {
    if (!editorReady) {
      return;
    }

    const editorView = bridge.editorActions._privateGetEditorView()!;

    const unsubscribeFromToolbarAndPickerUpdates =
      subscribeToToolbarAndPickerUpdates(
        editorView,
        ({ dateState, statusState, toolbarConfig }) => {
          if (dateState?.showDatePickerAt) {
            const node = editorView.state.doc.nodeAt(
              dateState.showDatePickerAt,
            );
            if (!node) {
              return;
            }

            const config = createFloatingToolbarConfigForDate(
              node,
              intl,
              bridge.getPluginInjectionApi(),
            );
            bridge.mobileEditingToolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
              config,
              node,
            );
          } else if (statusState?.showStatusPickerAt) {
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
            if (isPanelNode(toolbarConfig.node)) {
              toolbarConfig.config = createFloatingToolbarConfigForPanel(
                editorConfiguration,
                toolbarConfig,
              );
              bridge.mobileEditingToolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
                toolbarConfig.config,
                toolbarConfig.node,
              );
            } else if (isCaptionNode(editorView)) {
              bridge.mobileEditingToolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
                undefined,
                null,
              );
            } else {
              bridge.mobileEditingToolbarActions.notifyNativeBridgeForEditCapabilitiesChanges(
                toolbarConfig.config,
                toolbarConfig.node,
              );
            }
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
