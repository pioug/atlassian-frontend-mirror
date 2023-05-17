import { Plugin, EditorState } from 'prosemirror-state';
import { PmHistoryPluginState } from './pm-history-types';
import { pmHistoryPluginKey } from '@atlaskit/editor-common/utils';

export const getPmHistoryPlugin = (state: EditorState): Plugin | undefined => {
  return state.plugins.find(
    (plugin) => (plugin as any).key === pmHistoryPluginKey,
  );
};

export const getPmHistoryPluginState = (
  state: EditorState,
): PmHistoryPluginState | undefined => {
  const pmHistoryPlugin = getPmHistoryPlugin(state);
  if (!pmHistoryPlugin) {
    return;
  }
  return pmHistoryPlugin.getState(state);
};
