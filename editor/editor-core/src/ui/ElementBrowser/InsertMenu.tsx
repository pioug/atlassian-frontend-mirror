import React, { useCallback } from 'react';
import { EditorView } from 'prosemirror-view';

import WithPluginState from '../WithPluginState';
import { pluginKey } from '../../plugins/quick-insert/plugin-key';
import { QuickInsertPluginState } from '../../plugins/quick-insert/types';
import { searchQuickInsertItems } from '../../plugins/quick-insert/search';

import { BlockMenuItem } from '../../plugins/insert-block/ui/ToolbarInsertBlock/create-items';
import { insertItem } from '../../plugins/quick-insert/commands';

import ElementBrowser from './ElementBrowser';

import styled from 'styled-components';

import { DN50, N0, N30A, N60A } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';

const ElementBrowserWrapper = styled.div`
  flex: 1 1 auto;
  height: 600px;
  padding: 8px;
  overflow: hidden;
  background-color: ${themed({ light: N0, dark: DN50 })()};
  border-radius: ${borderRadius()}px;
  box-shadow: 0 0 0 1px ${N30A}, 0 2px 1px ${N30A}, 0 0 20px -6px ${N60A};
`;

type Props = {
  editorView: EditorView;
  dropdownItems: BlockMenuItem[];
  onClose: () => void;
};

const InlineElementBrowser = ({
  quickInsertState,
  editorView,
  onClose,
}: {
  editorView: EditorView;
  quickInsertState: QuickInsertPluginState;
  onClose: () => void;
}) => {
  const getItems = useCallback(
    (query?: string, category?: string) =>
      searchQuickInsertItems(quickInsertState, {})(query, category),
    [quickInsertState],
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
    <ElementBrowserWrapper>
      <ElementBrowser
        mode="inline"
        getItems={getItems}
        onInsertItem={onInsertItem}
        showSearch
        showCategories={false}
      />
    </ElementBrowserWrapper>
  );
};

export default ({ editorView, dropdownItems, onClose }: Props) => {
  const render = useCallback(
    ({ quickInsertState }) => (
      <InlineElementBrowser
        quickInsertState={quickInsertState}
        editorView={editorView}
        onClose={onClose}
      />
    ),
    [editorView, onClose],
  );

  return (
    <WithPluginState
      plugins={{ quickInsertState: pluginKey }}
      render={render}
    />
  );
};
