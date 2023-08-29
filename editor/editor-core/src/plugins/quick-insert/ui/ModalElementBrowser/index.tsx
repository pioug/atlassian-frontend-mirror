import React, { useCallback } from 'react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import WithPluginState from '../../../../ui/WithPluginState';
import { pluginKey } from '../../plugin-key';
import type { QuickInsertPluginState } from '@atlaskit/editor-common/types';

import ModalElementBrowser from '../../../../ui/ElementBrowser/ModalElementBrowser';

import { closeElementBrowserModal, insertItem } from '../../commands';
import { getQuickInsertSuggestions } from '../../search';

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
  quickInsertState: QuickInsertPluginState | undefined;
  helpUrl?: string;
}) => {
  const getItems = useCallback(
    (query?: string, category?: string) =>
      getQuickInsertSuggestions(
        {
          query,
          category,
        },
        quickInsertState?.lazyDefaultItems,
        quickInsertState?.providedItems,
      ),
    [quickInsertState?.lazyDefaultItems, quickInsertState?.providedItems],
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
    [editorView, focusInEditor],
  );

  const onClose = useCallback(() => {
    closeElementBrowserModal()(editorView.state, editorView.dispatch);
    focusInEditor();
  }, [editorView, focusInEditor]);

  return (
    <ModalElementBrowser
      getItems={getItems}
      onInsertItem={onInsertItem}
      helpUrl={helpUrl}
      isOpen={quickInsertState?.isElementBrowserModalOpen || false}
      emptyStateHandler={quickInsertState?.emptyStateHandler}
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
