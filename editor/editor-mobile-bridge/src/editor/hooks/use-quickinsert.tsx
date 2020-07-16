import React from 'react';
import { allowListPayloadType, EventTypes } from '../event-dispatch';
import { getEnableQuickInsertValue } from '../../query-param-reader';
import { createQuickInsertProvider } from '../../providers';
import WebBridgeImpl from '../native-to-web';
import { EditorProps } from '@atlaskit/editor-core';

export function useQuickInsert(
  bridge: WebBridgeImpl,
): EditorProps['quickInsert'] {
  const [quickAllowList, setQuickAllowList] = React.useState<
    allowListPayloadType
  >(bridge.allowList);

  const quickInsert = React.useMemo(() => {
    if (!getEnableQuickInsertValue()) {
      return false;
    }

    return {
      provider: createQuickInsertProvider(
        bridge.quickInsertItems,
        quickAllowList,
      ),
    };
  }, [bridge.quickInsertItems, quickAllowList]);

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
