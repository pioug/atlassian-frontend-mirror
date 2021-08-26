import React, { useCallback } from 'react';
import { EditorView } from 'prosemirror-view';

import WithPluginState from '../../../../ui/WithPluginState';
import { pluginKey } from '../../plugin-key';
import { QuickInsertPluginState } from '../../types';
import { searchQuickInsertItems } from '../../search';

import ModalElementBrowser from '../../../../ui/ElementBrowser/ModalElementBrowser';

import { closeElementBrowserModal, insertItem } from '../../commands';

type Props = {
  editorView: EditorView;
  helpUrl: string | undefined;
};

const Modal = ({
  quickInsertState,
  editorView,
  helpUrl,
}: {
  editorView: EditorView;
  quickInsertState: QuickInsertPluginState;
  helpUrl?: string;
}) => {
  const getItems = useCallback(
    (query?: string, category?: string) =>
      searchQuickInsertItems(quickInsertState, {})(query, category),
    [quickInsertState],
  );

  const focusInEditor = useCallback(() => {
    if (!editorView.hasFocus()) {
      editorView.focus();
    }
  }, [editorView]);

  const onInsertItem = useCallback(
    (item) => {
      closeElementBrowserModal()(editorView.state, editorView.dispatch);
      focusInEditor();
      insertItem(item)(editorView.state, editorView.dispatch);
    },
    [editorView.dispatch, editorView.state, focusInEditor],
  );

  const onClose = useCallback(() => {
    closeElementBrowserModal()(editorView.state, editorView.dispatch);
    focusInEditor();
  }, [editorView.dispatch, editorView.state, focusInEditor]);

  return (
    <ModalElementBrowser
      getItems={getItems}
      onInsertItem={onInsertItem}
      helpUrl={helpUrl}
      isOpen={
        (quickInsertState && quickInsertState.isElementBrowserModalOpen) ||
        false
      }
      emptyStateHandler={quickInsertState && quickInsertState.emptyStateHandler}
      onClose={onClose}
    />
  );
};

export default ({ editorView, helpUrl }: Props) => {
  const render = useCallback(
    ({ quickInsertState }) => (
      <Modal
        quickInsertState={quickInsertState}
        editorView={editorView}
        helpUrl={helpUrl}
      />
    ),
    [editorView, helpUrl],
  );

  return (
    <WithPluginState
      plugins={{ quickInsertState: pluginKey }}
      render={render}
    />
  );
};
