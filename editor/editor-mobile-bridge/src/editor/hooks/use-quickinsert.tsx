import React from 'react';
import type { allowListPayloadType } from '../event-dispatch';
import { EventTypes } from '../event-dispatch';
import { createQuickInsertProvider } from '../../providers';
import type WebBridgeImpl from '../native-to-web';
import type { EditorProps } from '@atlaskit/editor-core';

export function useQuickInsert(
  bridge: WebBridgeImpl,
  isQuickInsertEnabled: boolean,
): EditorProps['quickInsert'] {
  const [quickAllowList, setQuickAllowList] =
    React.useState<allowListPayloadType>(bridge.allowList);

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
