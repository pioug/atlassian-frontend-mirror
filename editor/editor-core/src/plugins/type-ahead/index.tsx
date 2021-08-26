import React from 'react';
import { EditorPlugin } from '../../types/editor-plugin';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type { EditorView } from 'prosemirror-view';
import type {
  TypeAheadHandler,
  PopupMountPointReference,
  TypeAheadPluginState,
} from './types';
import { createPlugin } from './pm-plugins/main';
import { createPlugin as createInsertItemPlugin } from './pm-plugins/insert-item-plugin';
import WithPluginState from '../../ui/WithPluginState';
import { typeAheadQuery } from '@atlaskit/adf-schema';
import { pluginKey as typeAheadPluginKey } from './pm-plugins/key';
import { inputRulePlugin } from './pm-plugins/input-rules';
import { TypeAheadPopup } from './ui/TypeAheadPopup';
import { getPluginState } from './utils';
import { useItemInsert } from './ui/hooks/use-item-insert';
import { updateSelectedIndex } from './commands/update-selected-index';
import { StatsModifier } from './stats-modifier';
import {
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
  fireAnalyticsEvent,
  FireAnalyticsCallback,
} from '../analytics';

export type TypeAheadPluginOptions = {
  isMobile?: boolean;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
};

type TypeAheadMenuType = {
  typeAheadState: TypeAheadPluginState;
  editorView: EditorView;
  popupMountRef: PopupMountPointReference;
  fireAnalyticsCallback: FireAnalyticsCallback;
};
const TypeAheadMenu: React.FC<TypeAheadMenuType> = React.memo(
  ({ editorView, popupMountRef, typeAheadState, fireAnalyticsCallback }) => {
    const isOpen = typeAheadState.decorationSet.find().length > 0;
    const {
      triggerHandler,
      items,
      selectedIndex,
      decorationElement,
      decorationSet,
      query,
    } = typeAheadState;

    const [onItemInsert, , onItemMatch] = useItemInsert(
      triggerHandler!,
      editorView,
      items,
    );
    const setSelectedItem = React.useCallback(
      ({ index: nextIndex }) => {
        queueMicrotask(() => {
          updateSelectedIndex(nextIndex)(editorView.state, editorView.dispatch);
        });
      },
      [editorView],
    );
    const insertItem = React.useCallback(
      (mode: SelectItemMode = SelectItemMode.SELECTED, index: number) => {
        queueMicrotask(() => {
          onItemInsert({ mode, index, query });
        });
      },
      [onItemInsert, query],
    );

    React.useEffect(() => {
      if (!isOpen || !query) {
        return;
      }

      const isLastCharSpace = query[query.length - 1] === ' ';
      if (!isLastCharSpace) {
        return;
      }

      const result = onItemMatch({
        mode: SelectItemMode.SPACE,
        query: query.trim(),
      });

      if (!result) {
        return;
      }
    }, [isOpen, query, onItemMatch]);

    if (
      !isOpen ||
      !triggerHandler ||
      !(decorationElement instanceof HTMLElement) ||
      items.length === 0
    ) {
      return null;
    }

    return (
      <TypeAheadPopup
        editorView={editorView}
        popupsMountPoint={popupMountRef.current?.popupsMountPoint}
        popupsBoundariesElement={popupMountRef.current?.popupsBoundariesElement}
        popupsScrollableElement={popupMountRef.current?.popupsScrollableElement}
        anchorElement={decorationElement}
        triggerHandler={triggerHandler}
        fireAnalyticsCallback={fireAnalyticsCallback}
        items={items}
        selectedIndex={selectedIndex}
        setSelectedItem={setSelectedItem}
        onItemInsert={insertItem}
        decorationSet={decorationSet}
        isEmptyQuery={!query}
      />
    );
  },
);

const typeAheadPlugin = (options?: TypeAheadPluginOptions): EditorPlugin => {
  const fireAnalyticsCallback = fireAnalyticsEvent(
    options?.createAnalyticsEvent,
  );
  const popupMountRef: PopupMountPointReference = {
    current: null,
  };
  return {
    name: 'typeAhead',

    marks() {
      // We need to keep this to make sure
      // All documents with typeahead marks will be loaded normaly
      return [{ name: 'typeAheadQuery', mark: typeAheadQuery }];
    },

    pmPlugins(typeAhead: Array<TypeAheadHandler> = []) {
      return [
        {
          name: 'typeAhead',
          plugin: ({ dispatch, reactContext }) =>
            createPlugin({
              reactContext,
              popupMountRef,
              reactDispatch: dispatch,
              typeAheadHandlers: typeAhead,
              createAnalyticsEvent: options?.createAnalyticsEvent,
            }),
        },
        {
          name: 'typeAheadInsertItem',
          plugin: createInsertItemPlugin,
        },
        {
          name: 'typeAheadInputRule',
          plugin: ({ schema, featureFlags }) =>
            inputRulePlugin(schema, typeAhead, featureFlags),
        },
      ];
    },

    contentComponent({
      editorView,
      containerElement,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
    }) {
      popupMountRef.current = {
        popupsMountPoint: popupsMountPoint || containerElement || undefined,
        popupsBoundariesElement,
        popupsScrollableElement,
      };

      return (
        <WithPluginState
          plugins={{ typeAheadState: typeAheadPluginKey }}
          render={({ typeAheadState }) => {
            if (!typeAheadState) {
              return null;
            }
            return (
              <TypeAheadMenu
                editorView={editorView}
                popupMountRef={popupMountRef}
                typeAheadState={typeAheadState}
                fireAnalyticsCallback={fireAnalyticsCallback}
              />
            );
          }}
        />
      );
    },

    onEditorViewStateUpdated({ oldEditorState, newEditorState }) {
      const oldPluginState = getPluginState(oldEditorState);
      const newPluginState = getPluginState(newEditorState);

      if (!oldPluginState || !newPluginState) {
        return;
      }

      const { triggerHandler: oldTriggerHandler } = oldPluginState;
      const { triggerHandler: newTriggerHandler } = newPluginState;

      const isANewHandler = oldTriggerHandler !== newTriggerHandler;
      if (oldTriggerHandler?.dismiss && isANewHandler) {
        oldTriggerHandler.dismiss({
          editorState: newEditorState,
          query: oldPluginState.query,
          stats: (oldPluginState.stats || new StatsModifier()).serialize(),
        });
      }

      if (newTriggerHandler?.onOpen && isANewHandler) {
        newTriggerHandler.onOpen(newEditorState);
      }

      if (newTriggerHandler && isANewHandler && options?.createAnalyticsEvent) {
        fireAnalyticsCallback({
          payload: {
            action: ACTION.INVOKED,
            actionSubject: ACTION_SUBJECT.TYPEAHEAD,
            actionSubjectId: newTriggerHandler.id || 'not_set',
            attributes: {
              inputMethod: newPluginState.inputMethod || INPUT_METHOD.KEYBOARD,
            },
            eventType: EVENT_TYPE.UI,
          },
        });
      }
    },
  };
};

export default typeAheadPlugin;

export { typeAheadPluginKey };
export type { TypeAheadHandler, TypeAheadPluginState } from './types';
