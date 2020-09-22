import React, { useCallback, useState } from 'react';
import { EditorView } from 'prosemirror-view';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';

import WithPluginState from '../WithPluginState';
import { pluginKey } from '../../plugins/quick-insert/plugin-key';
import { QuickInsertPluginState } from '../../plugins/quick-insert/types';
import {
  getFeaturedQuickInsertItems,
  searchQuickInsertItems,
} from '../../plugins/quick-insert/search';

import { insertItem } from '../../plugins/quick-insert/commands';
import { ELEMENT_ITEM_HEIGHT } from './constants';

import ElementBrowser from './components/ElementBrowserLoader';

import styled from 'styled-components';

const getWrapperHeight = ({ itemCount }: { itemCount: number }) => {
  /* Figure based on visuals,
   * to exclude the searchbar and padding/margin above ElementList.
   */
  const EXTRA_SPACE_EXCLUDING_ELEMENTLIST = 92;
  if (itemCount > 0 && itemCount < 10) {
    return itemCount * ELEMENT_ITEM_HEIGHT + EXTRA_SPACE_EXCLUDING_ELEMENTLIST;
  }
  return 600;
};

const ElementBrowserWrapper = styled.div`
  flex: 1;
  box-sizing: border-box;
  height: ${getWrapperHeight}px;

  overflow: hidden;
`;

type Props = {
  editorView: EditorView;
  quickInsertDropdownItems: QuickInsertItem[];
  onClose: () => void;
};

export const InlineElementBrowser = ({
  quickInsertState,
  quickInsertDropdownItems,
  editorView,
  onClose,
}: {
  editorView: EditorView;
  quickInsertState: QuickInsertPluginState;
  quickInsertDropdownItems: QuickInsertItem[];
  onClose: () => void;
}) => {
  const [itemCount, setItemCount] = useState(0);

  const getItems = useCallback(
    (query?: string, category?: string) => {
      if (query) {
        const res = searchQuickInsertItems(quickInsertState, {})(
          query,
          category,
        );
        setItemCount(res.length);
        return res;
      }

      const res = quickInsertDropdownItems.concat(
        getFeaturedQuickInsertItems(quickInsertState, {})(),
      ) as QuickInsertItem[];
      setItemCount(res.length);
      return res;
    },
    [quickInsertState, quickInsertDropdownItems],
  );

  const onInsertItem = useCallback(
    item => {
      onClose();
      if (!editorView.hasFocus()) {
        editorView.focus();
      }
      insertItem(item)(editorView.state, editorView.dispatch);
    },
    [editorView, onClose],
  );
  return (
    <ElementBrowserWrapper itemCount={itemCount}>
      <ElementBrowser
        mode="inline"
        getItems={getItems}
        onInsertItem={onInsertItem}
        showSearch
        showCategories={false}
        // On page resize we want the InlineElementBrowser to show updated tools
        key={quickInsertDropdownItems.length}
      />
    </ElementBrowserWrapper>
  );
};

export default function InsertMenu({
  editorView,
  onClose,
  quickInsertDropdownItems,
}: Props) {
  const render = useCallback(
    ({ quickInsertState }) => (
      <InlineElementBrowser
        quickInsertState={quickInsertState}
        editorView={editorView}
        quickInsertDropdownItems={quickInsertDropdownItems}
        onClose={onClose}
      />
    ),
    [editorView, onClose, quickInsertDropdownItems],
  );

  return (
    <WithPluginState
      plugins={{ quickInsertState: pluginKey }}
      render={render}
    />
  );
}
