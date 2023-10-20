import { pmHistoryPluginKey } from '@atlaskit/editor-common/utils';
import type { EditorState, Plugin } from '@atlaskit/editor-prosemirror/state';

import type { PmHistoryPluginState } from './pm-history-types';

export const getPmHistoryPlugin = (state: EditorState): Plugin | undefined => {
  return state.plugins.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugin => (plugin as any).key === pmHistoryPluginKey,
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
