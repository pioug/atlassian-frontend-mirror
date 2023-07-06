import React from 'react';
import { IntlShape } from 'react-intl-next';
import { allowListPayloadType, EventTypes } from '../event-dispatch';
import { createQuickInsertProvider } from '../../providers';
import WebBridgeImpl from '../native-to-web';
import {
  EditorProps,
  processQuickInsertItems,
  QuickInsertItem,
  quickInsertPluginKey,
} from '@atlaskit/editor-core';
import { toNativeBridge } from '../web-to-native';

export function useQuickInsert(
  bridge: WebBridgeImpl,
  intl: IntlShape,
  isQuickInsertEnabled: boolean,
): EditorProps['quickInsert'] {
  const [quickAllowList, setQuickAllowList] =
    React.useState<allowListPayloadType>(bridge.allowList);

  const quickInsertItems = React.useMemo(() => {
    if (bridge.editorView) {
      const quickInsertPluginState = quickInsertPluginKey.getState(
        bridge.editorView.state,
      );
      if (!quickInsertPluginState) {
        return;
      }
      return processQuickInsertItems(
        quickInsertPluginState.lazyDefaultItems(),
        intl,
        {
          hyperlink: (quickInsertItem: QuickInsertItem) => {
            // Call native side for items that have to be handled natively
            toNativeBridge.typeAheadItemSelected(
              JSON.stringify(quickInsertItem),
            );
          },
        },
      );
    }
  }, [bridge.editorView, intl]);

  // Hook for intl changes
  React.useEffect(() => {
    if (quickInsertItems) {
      bridge.setQuickInsertItems(quickInsertItems);
    }
  }, [bridge, intl, quickInsertItems]);

  const quickInsert = React.useMemo(() => {
    if (!isQuickInsertEnabled) {
      return false;
    }

    return {
      provider: createQuickInsertProvider(
        bridge,
        quickAllowList,
        isQuickInsertEnabled,
      ),
    };
  }, [bridge, isQuickInsertEnabled, quickAllowList]);

  const updateQuickAllowList = React.useCallback(
    (payload: allowListPayloadType) => {
      setQuickAllowList(payload);
    },
    [setQuickAllowList],
  );

  // TODO: This might not be needed once we implement `editorReady` event
  React.useLayoutEffect(() => {
    bridge.eventEmitter.on(
      EventTypes.SET_NEW_ALLOWED_INSERT_LIST,
      updateQuickAllowList,
    );
    bridge.eventEmitter.on(
      EventTypes.ADD_NEW_ALLOWED_INSERT_LIST_ITEM,
      updateQuickAllowList,
    );
    bridge.eventEmitter.on(
      EventTypes.REMOVE_ALLOWED_INSERT_LIST_ITEM,
      updateQuickAllowList,
    );

    return () => {
      bridge.eventEmitter.off(
        EventTypes.SET_NEW_ALLOWED_INSERT_LIST,
        updateQuickAllowList,
      );
      bridge.eventEmitter.off(
        EventTypes.ADD_NEW_ALLOWED_INSERT_LIST_ITEM,
        updateQuickAllowList,
      );
      bridge.eventEmitter.off(
        EventTypes.REMOVE_ALLOWED_INSERT_LIST_ITEM,
        updateQuickAllowList,
      );
    };
  }, [bridge.eventEmitter, updateQuickAllowList]);

  return quickInsert;
}
