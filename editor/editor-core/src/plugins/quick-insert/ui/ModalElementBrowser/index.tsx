import React, { useCallback } from 'react';
import { EditorView } from 'prosemirror-view';

import WithPluginState from '../../../../ui/WithPluginState';
import { pluginKey } from '../../plugin-key';
import { QuickInsertPluginState } from '../../types';
import { searchQuickInsertItems } from '../../search';

import ModalElementBrowser from './ModalElementBrowser';

import { closeElementBrowserModal, insertItem } from '../../commands';

type Props = {
  editorView: EditorView;
};

const Modal = ({
  quickInsertState,
  editorView,
}: {
  editorView: EditorView;
  quickInsertState: QuickInsertPluginState;
}) => {
  const getItems = useCallback(
    (query?: string, category?: string) =>
      searchQuickInsertItems(quickInsertState, {})(query, category),
    [quickInsertState],
  );

  const onSelectItem = useCallback(
    item => {
      closeElementBrowserModal()(editorView.state, editorView.dispatch);
      if (!editorView.hasFocus()) {
        editorView.focus();
      }
      insertItem(item)(editorView.state, editorView.dispatch);
    },
    [editorView],
  );

  const onClose = useCallback(() => {
    closeElementBrowserModal()(editorView.state, editorView.dispatch);
  }, [editorView]);

  return (
    <ModalElementBrowser
      getItems={getItems}
      onSelectItem={onSelectItem}
      isOpen={
        (quickInsertState && quickInsertState.isElementBrowserModalOpen) ||
        false
      }
      onClose={onClose}
    />
  );
};

export default ({ editorView }: Props) => {
  const render = useCallback(
    ({ quickInsertState }) => (
      <Modal quickInsertState={quickInsertState} editorView={editorView} />
    ),
    [editorView],
  );

  return (
    <WithPluginState
      plugins={{ quickInsertState: pluginKey }}
      render={render}
    />
  );
};
