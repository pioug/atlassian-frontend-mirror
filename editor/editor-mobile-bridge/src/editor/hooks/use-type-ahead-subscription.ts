import { useEffect } from 'react';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import { subscribeTypeAheadUpdates } from '@atlaskit/editor-core';
import type EditorConfiguration from '../editor-configuration';
import { toNativeBridge } from '../web-to-native';
import type WebBridgeImpl from '../native-to-web';

export function useTypeAheadSubscription(
  editorReady: boolean,
  bridge: WebBridgeImpl,
  editorConfiguration: EditorConfiguration,
) {
  const editorView = bridge.editorActions._privateGetEditorView()!;

  useEffect(() => {
    if (!editorReady) {
      return;
    }
    const unsubscribe = subscribeTypeAheadUpdates(
      editorView,
      ({ newPluginState, oldPluginState }) => {
        const wasClosed =
          !newPluginState.triggerHandler && oldPluginState.triggerHandler;

        if (wasClosed) {
          toNativeBridge.call('typeAheadBridge', 'dismissTypeAhead');
          return;
        }

        if (!newPluginState.triggerHandler) {
          return;
        }
        const {
          triggerHandler: { trigger },
        } = newPluginState;

        const wasOpened =
          oldPluginState.triggerHandler !== newPluginState.triggerHandler;
        const hasQueryChanged = newPluginState.query !== oldPluginState.query;
        const isQuickInsert =
          newPluginState.triggerHandler.id ===
          TypeAheadAvailableNodes.QUICK_INSERT;
        const query = newPluginState.query;

        if (isQuickInsert && (wasOpened || hasQueryChanged)) {
          bridge.getPluginInjectionApi()?.dependencies.core.actions.execute(
            bridge
              .getPluginInjectionApi()
              ?.dependencies.quickInsert?.commands.search({
                query,
                disableDefaultItems: true,
              }),
          );
          const quickInsertList = bridge
            .getPluginInjectionApi()
            ?.dependencies.quickInsert?.sharedState.currentState()?.suggestions;

          const quickInsertItems = quickInsertList?.map(({ id, title }) => ({
            id,
            title,
          }));

          toNativeBridge.call('typeAheadBridge', 'typeAheadDisplayItems', {
            query,
            trigger,
            items: JSON.stringify(quickInsertItems),
          });
        } else if (hasQueryChanged || wasOpened) {
          toNativeBridge.call('typeAheadBridge', 'typeAheadQuery', {
            query,
            trigger,
          });
        }
      },
    );

    return () => {
      unsubscribe();
    };
    // We need to recreate the hook when there is a new editorConfiguration
  }, [editorReady, editorConfiguration, editorView, bridge]); // eslint-disable-line react-hooks/exhaustive-deps
}
