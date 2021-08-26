import React, {
  useMemo,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  useState,
} from 'react';
import type { EditorView } from 'prosemirror-view';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { TypeAheadHandler, TypeAheadInputMethod } from '../types';

import { CloseSelectionOptions } from '../constants';
import { moveSelectedIndex, getPluginState } from '../utils';
import { updateQuery } from '../commands/update-query';
import { InputQuery } from './InputQuery';
import { useLoadItems } from './hooks/use-load-items';
import { useItemInsert } from './hooks/use-item-insert';
import { useOnForceSelect } from './hooks/use-on-force-select';

type WrapperProps = {
  triggerHandler: TypeAheadHandler;
  editorView: EditorView;
  anchorElement: HTMLElement;
  getDecorationPosition: () => number;
  shouldFocusCursorInsideQuery: boolean;
  onUndoRedo?: (inputType: 'historyUndo' | 'historyRedo') => boolean;
  reopenQuery?: string;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  inputMethod?: TypeAheadInputMethod;
};

export const WrapperTypeAhead: React.FC<WrapperProps> = React.memo(
  ({
    triggerHandler,
    editorView,
    anchorElement,
    shouldFocusCursorInsideQuery,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    createAnalyticsEvent,
    inputMethod,
    getDecorationPosition,
    reopenQuery,
    onUndoRedo,
  }) => {
    const [closed, setClosed] = useState(false);
    const [query, setQuery] = useState<string>(reopenQuery || '');
    const queryRef = useRef(query);
    const editorViewRef = useRef(editorView);
    const items = useLoadItems(triggerHandler, editorView, query);

    useLayoutEffect(() => {
      queryRef.current = query;
    }, [query]);

    const [onItemInsert, onTextInsert] = useItemInsert(
      triggerHandler,
      editorView,
      items,
    );

    const selectNextItem = useMemo(
      () =>
        moveSelectedIndex({
          editorView,
          direction: 'next',
        }),
      [editorView],
    );
    const selectPreviousItem = useMemo(
      () =>
        moveSelectedIndex({
          editorView,
          direction: 'previous',
        }),
      [editorView],
    );

    const cancel = useCallback(
      ({
        setSelectionAt,
        addPrefixTrigger,
        text,
        forceFocusOnEditor,
      }: {
        setSelectionAt: CloseSelectionOptions;
        addPrefixTrigger: boolean;
        text: string;
        forceFocusOnEditor: boolean;
      }) => {
        setClosed(true);

        const fullquery = addPrefixTrigger
          ? `${triggerHandler.trigger}${text}`
          : text;
        onTextInsert({ forceFocusOnEditor, setSelectionAt, text: fullquery });
      },
      [triggerHandler, onTextInsert],
    );

    const insertSelectedItem = useCallback(
      (mode: SelectItemMode = SelectItemMode.SELECTED) => {
        const { current: view } = editorViewRef;

        const { selectedIndex } = getPluginState(view.state);
        setClosed(true);
        queueMicrotask(() => {
          onItemInsert({
            mode,
            index: selectedIndex,
            query: queryRef.current,
          });
        });
      },
      [onItemInsert],
    );

    const showTypeAheadPopupList = useCallback(() => {}, []);
    const closePopup = useCallback(() => {
      setClosed(true);
    }, []);

    useEffect(() => {
      const { current: view } = editorViewRef;
      const pluginState = getPluginState(view.state);

      if (
        query.length === 0 ||
        query === pluginState.query ||
        !pluginState.triggerHandler
      ) {
        return;
      }

      updateQuery(query)(view.state, view.dispatch);
    }, [query, reopenQuery]);

    useOnForceSelect({
      triggerHandler,
      items,
      query,
      editorView,
      closePopup,
    });

    if (closed) {
      return null;
    }
    return (
      <InputQuery
        triggerQueryPrefix={triggerHandler.trigger}
        onQueryChange={setQuery}
        onItemSelect={insertSelectedItem}
        selectNextItem={selectNextItem}
        selectPreviousItem={selectPreviousItem}
        onQueryFocus={showTypeAheadPopupList}
        cancel={cancel}
        forceFocus={shouldFocusCursorInsideQuery}
        onUndoRedo={onUndoRedo}
        reopenQuery={reopenQuery}
      />
    );
  },
);
