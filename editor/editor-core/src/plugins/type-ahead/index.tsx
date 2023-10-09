/**
 *
 * Revamped typeahead using decorations instead of the `typeAheadQuery` mark
 *
 * https://product-fabric.atlassian.net/wiki/spaces/E/pages/2992177582/Technical+TypeAhead+Data+Flow
 *
 *
 */
import React from 'react';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type {
  TypeAheadInputMethod,
  TypeAheadHandler,
  PopupMountPointReference,
  TypeAheadPluginState,
} from './types';
import { createPlugin } from './pm-plugins/main';
import { createPlugin as createInsertItemPlugin } from './pm-plugins/insert-item-plugin';
import { WithPluginState } from '@atlaskit/editor-common/with-plugin-state';
import { typeAheadQuery } from '@atlaskit/adf-schema';
import { pluginKey as typeAheadPluginKey } from './pm-plugins/key';
import { inputRulePlugin } from './pm-plugins/input-rules';
import { TypeAheadPopup } from './ui/TypeAheadPopup';
import {
  findHandler,
  getPluginState,
  isTypeAheadOpen,
  isTypeAheadAllowed,
  getTypeAheadQuery,
  getTypeAheadHandler,
} from './utils';
import { useItemInsert } from './ui/hooks/use-item-insert';
import { updateSelectedIndex } from './commands/update-selected-index';
import { StatsModifier } from './stats-modifier';

import type { TypeAheadItem, Command } from '@atlaskit/editor-common/types';
import type {
  EditorAnalyticsAPI,
  FireAnalyticsCallback,
} from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
  fireAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import type { CloseSelectionOptions } from './constants';
import { openTypeAheadAtCursor } from './transforms/open-typeahead-at-cursor';
import { closeTypeAhead } from './transforms/close-type-ahead';
import { insertTypeAheadItem } from './commands/insert-type-ahead-item';
import type {
  TypeAheadPluginOptions,
  TypeAheadPlugin,
} from '@atlaskit/editor-plugin-type-ahead';

type TypeAheadMenuType = {
  typeAheadState: TypeAheadPluginState;
  editorView: EditorView;
  popupMountRef: PopupMountPointReference;
  fireAnalyticsCallback: FireAnalyticsCallback;
};

export type { TypeAheadPluginOptions, TypeAheadPlugin };
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

    const [onItemInsert, onTextInsert, onItemMatch] = useItemInsert(
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

    const cancel = React.useCallback(
      ({
        setSelectionAt,
        addPrefixTrigger,
        forceFocusOnEditor,
      }: {
        setSelectionAt: CloseSelectionOptions;
        addPrefixTrigger: boolean;
        forceFocusOnEditor: boolean;
      }) => {
        const fullQuery = addPrefixTrigger
          ? `${triggerHandler?.trigger}${query}`
          : query;
        onTextInsert({ forceFocusOnEditor, setSelectionAt, text: fullQuery });
      },
      [triggerHandler, onTextInsert, query],
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
        cancel={cancel}
      />
    );
  },
);

const createOpenAtTransaction =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  (props: OpenTypeAheadProps) =>
  (tr: Transaction): boolean => {
    const { triggerHandler, inputMethod } = props;

    openTypeAheadAtCursor({ triggerHandler, inputMethod })({ tr });

    editorAnalyticsAPI?.attachAnalyticsEvent({
      action: ACTION.INVOKED,
      actionSubject: ACTION_SUBJECT.TYPEAHEAD,
      actionSubjectId: triggerHandler.id,
      attributes: { inputMethod },
      eventType: EVENT_TYPE.UI,
    })(tr);

    return true;
  };

type EditorViewRef = Record<'current', EditorView | null>;
type OpenTypeAheadProps = {
  triggerHandler: TypeAheadHandler;
  inputMethod: TypeAheadInputMethod;
  query?: string;
};
const createOpenTypeAhead =
  (
    editorViewRef: EditorViewRef,
    editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
  ) =>
  (props: OpenTypeAheadProps): boolean => {
    if (!editorViewRef.current) {
      return false;
    }

    const { current: view } = editorViewRef;
    const { tr } = view.state;

    createOpenAtTransaction(editorAnalyticsAPI)(props)(tr);

    view.dispatch(tr);

    return true;
  };

type InsertTypeAheadItemProps = {
  triggerHandler: TypeAheadHandler;
  contentItem: TypeAheadItem;
  query: string;
  sourceListItem: TypeAheadItem[];
  mode?: SelectItemMode;
};
const createInsertTypeAheadItem =
  (editorViewRef: EditorViewRef) =>
  (props: InsertTypeAheadItemProps): boolean => {
    if (!editorViewRef.current) {
      return false;
    }

    const { current: view } = editorViewRef;
    const { triggerHandler, contentItem, query, sourceListItem, mode } = props;

    insertTypeAheadItem(view)({
      handler: triggerHandler,
      item: contentItem,
      mode: mode || SelectItemMode.SELECTED,
      query,
      sourceListItem,
    });

    return true;
  };

const createFindHandlerByTrigger =
  (editorViewRef: EditorViewRef) =>
  (trigger: string): TypeAheadHandler | null => {
    if (!editorViewRef.current) {
      return null;
    }

    const { current: view } = editorViewRef;

    return findHandler(trigger, view.state);
  };

type CloseTypeAheadProps = {
  insertCurrentQueryAsRawText: boolean;
  attachCommand?: Command;
};
const createCloseTypeAhead =
  (editorViewRef: EditorViewRef) =>
  (options: CloseTypeAheadProps): boolean => {
    if (!editorViewRef.current) {
      return false;
    }

    const { current: view } = editorViewRef;

    const currentQuery = getTypeAheadQuery(view.state) || '';
    const { state } = view;

    let tr = state.tr;

    if (options.attachCommand) {
      const fakeDispatch = (customTr: Transaction) => {
        tr = customTr;
      };

      options.attachCommand(state, fakeDispatch);
    }

    closeTypeAhead(tr);

    if (
      options.insertCurrentQueryAsRawText &&
      currentQuery &&
      currentQuery.length > 0
    ) {
      const handler = getTypeAheadHandler(state);
      if (!handler) {
        return false;
      }
      const text = handler.trigger.concat(currentQuery);
      tr.replaceSelectionWith(state.schema.text(text));
    }

    view.dispatch(tr);

    if (!view.hasFocus()) {
      view.focus();
    }

    return true;
  };

/**
 *
 * Revamped typeahead using decorations instead of the `typeAheadQuery` mark
 *
 * https://product-fabric.atlassian.net/wiki/spaces/E/pages/2992177582/Technical+TypeAhead+Data+Flow
 *
 *
 */
const typeAheadPlugin: TypeAheadPlugin = ({ config: options, api }) => {
  const fireAnalyticsCallback = fireAnalyticsEvent(
    options?.createAnalyticsEvent,
  );
  const popupMountRef: PopupMountPointReference = {
    current: null,
  };
  const editorViewRef: EditorViewRef = { current: null };
  return {
    name: 'typeAhead',

    marks() {
      // We need to keep this to make sure
      // All documents with typeahead marks will be loaded normally
      return [{ name: 'typeAheadQuery', mark: typeAheadQuery }];
    },

    pmPlugins(typeAhead: Array<TypeAheadHandler> = []) {
      return [
        {
          name: 'typeAhead',
          plugin: ({ dispatch, getIntl }) =>
            createPlugin({
              getIntl,
              popupMountRef,
              reactDispatch: dispatch,
              typeAheadHandlers: typeAhead,
              createAnalyticsEvent: options?.createAnalyticsEvent,
            }),
        },
        {
          name: 'typeAheadEditorViewRef',
          plugin: () => {
            return new SafePlugin({
              view(view) {
                editorViewRef.current = view;

                return {
                  destroy() {
                    editorViewRef.current = null;
                  },
                };
              },
            });
          },
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

    getSharedState(editorState) {
      if (!editorState) {
        return {
          query: '',
        };
      }

      return {
        query: getTypeAheadQuery(editorState) || '',
      };
    },
    actions: {
      isOpen: isTypeAheadOpen,
      isAllowed: isTypeAheadAllowed,
      open: createOpenTypeAhead(editorViewRef, api?.analytics?.actions),
      openAtTransaction: createOpenAtTransaction(api?.analytics?.actions),
      findHandlerByTrigger: createFindHandlerByTrigger(editorViewRef),
      insert: createInsertTypeAheadItem(editorViewRef),
      close: createCloseTypeAhead(editorViewRef),
    },

    contentComponent({
      editorView,
      containerElement,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      wrapperElement,
    }) {
      popupMountRef.current = {
        popupsMountPoint: popupsMountPoint || wrapperElement || undefined,
        popupsBoundariesElement,
        popupsScrollableElement:
          popupsScrollableElement || containerElement || undefined,
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

    onEditorViewStateUpdated({
      originalTransaction,
      oldEditorState,
      newEditorState,
    }) {
      const oldPluginState = getPluginState(oldEditorState);
      const newPluginState = getPluginState(newEditorState);

      if (!oldPluginState || !newPluginState) {
        return;
      }

      const { triggerHandler: oldTriggerHandler } = oldPluginState;
      const { triggerHandler: newTriggerHandler } = newPluginState;

      const isANewHandler = oldTriggerHandler !== newTriggerHandler;
      if (oldTriggerHandler?.dismiss && isANewHandler) {
        const typeAheadMessage =
          originalTransaction.getMeta(typeAheadPluginKey);
        const wasItemInserted =
          typeAheadMessage && typeAheadMessage.action === 'INSERT_RAW_QUERY';

        oldTriggerHandler.dismiss({
          editorState: newEditorState,
          query: oldPluginState.query,
          stats: (oldPluginState.stats || new StatsModifier()).serialize(),
          wasItemInserted,
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
