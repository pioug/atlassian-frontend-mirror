import { EditorState } from 'prosemirror-state';

import { getPluginState } from '../pm-plugins/plugin-factory';

export function getAllowAddColumnCustomStep(state: EditorState): boolean {
  const tablePluginState = getPluginState(state);
  return (
    Boolean(tablePluginState) &&
    Boolean(tablePluginState.pluginConfig.allowAddColumnWithCustomStep)
  );
}
