import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { pluginKey as quickInsertPluginKey } from './plugin-key';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { searchQuickInsertItems } from './search';
import type { QuickInsertPluginOptions } from './types';

const getItems =
  (editorView: EditorView) =>
  (query: string, options?: QuickInsertPluginOptions): QuickInsertItem[] => {
    const pluginState = quickInsertPluginKey.getState(editorView.state);

    if (!pluginState) {
      return [];
    }

    return searchQuickInsertItems(pluginState, options)(query);
  };

export const createQuickInsertTools = (editorView: EditorView) => {
  return {
    getItems: getItems(editorView),
  };
};
