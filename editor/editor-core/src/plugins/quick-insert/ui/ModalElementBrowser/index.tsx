import React, { useCallback } from 'react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type {
  QuickInsertSharedState,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';

import ModalElementBrowser from './ModalElementBrowser';

import { closeElementBrowserModal, insertItem } from '../../commands';
import { getQuickInsertSuggestions } from '../../search';
import type { QuickInsertPlugin } from '../../';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';

type Props = {
  editorView: EditorView;
  helpUrl: string | undefined;
  pluginInjectionAPI: ExtractInjectionAPI<QuickInsertPlugin> | undefined;
};

const Modal = ({
  quickInsertState,
  editorView,
  helpUrl,
}: {
  editorView: EditorView;
  quickInsertState: QuickInsertSharedState | undefined;
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

export default ({ editorView, helpUrl, pluginInjectionAPI }: Props) => {
  const { quickInsertState } = useSharedPluginState(pluginInjectionAPI, [
    'quickInsert',
  ]);

  return (
    <Modal
      quickInsertState={quickInsertState ?? undefined}
      editorView={editorView}
      helpUrl={helpUrl}
    />
  );
};
