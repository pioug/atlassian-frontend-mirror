import React from 'react';
import { InjectedIntl } from 'react-intl';
import { allowListPayloadType, EventTypes } from '../event-dispatch';
import { createQuickInsertProvider } from '../../providers';
import WebBridgeImpl from '../native-to-web';
import {
  EditorProps,
  processQuickInsertItems,
  quickInsertPluginKey,
} from '@atlaskit/editor-core';

export function useQuickInsert(
  bridge: WebBridgeImpl,
  intl: InjectedIntl,
  isQuickInsertEnabled: boolean,
): EditorProps['quickInsert'] {
  const [quickAllowList, setQuickAllowList] = React.useState<
    allowListPayloadType
  >(bridge.allowList);

  const quickInsert = React.useMemo(() => {
    if (!isQuickInsertEnabled) {
      return false;
    }

    if (bridge.editorView) {
      const quickInsertPluginState = quickInsertPluginKey.getState(
        bridge.editorView.state,
      );
      bridge.quickInsertItems.resolve(
        processQuickInsertItems(
          quickInsertPluginState.lazyDefaultItems(),
          intl,
        ),
      );
    }

    return {
      provider: createQuickInsertProvider(
        bridge.quickInsertItems,
        quickAllowList,
        isQuickInsertEnabled,
      ),
    };
  }, [
    bridge.editorView,
    bridge.quickInsertItems,
    isQuickInsertEnabled,
    intl,
    quickAllowList,
  ]);

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
