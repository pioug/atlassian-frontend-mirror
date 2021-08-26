import { useRef, useState, useEffect } from 'react';

import type { EditorView } from 'prosemirror-view';
import type { TypeAheadItem, TypeAheadHandler } from '../../types';
import { updateListItem } from '../../commands/update-list-items';

const EMPTY_LIST_ITEM: Array<TypeAheadItem> = [];
export const useLoadItems = (
  triggerHandler: TypeAheadHandler,
  editorView: EditorView,
  query: string,
): Array<TypeAheadItem> => {
  const [items, setItems] = useState<Array<TypeAheadItem>>(EMPTY_LIST_ITEM);
  const componentIsMounted = useRef(true);
  const editorViewRef = useRef(editorView);

  useEffect(() => {
    const getItems = triggerHandler?.getItems;
    if (!getItems) {
      setItems(EMPTY_LIST_ITEM);
      return;
    }

    const options = {
      query: query || '',
      editorState: editorView.state,
    };

    const { current: view } = editorViewRef;
    getItems(options).then((result) => {
      const list = result.length > 0 ? result : EMPTY_LIST_ITEM;
      if (componentIsMounted.current) {
        setItems(list);
      }

      queueMicrotask(() => {
        updateListItem(list)(view.state, view.dispatch);
      });
    });

    // ignore because EditorView is mutable but we don't want to
    // call loadItems when it changes, only when the query changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerHandler, query]);

  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  return items;
};
