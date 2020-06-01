import { EditorState } from 'prosemirror-state';
import { pluginKey } from './plugin-key';

export function getParticipantsCount(state?: EditorState): number {
  if (!state) {
    return 1;
  }

  const pluginState = pluginKey.getState(state);
  return pluginState && pluginState.participants
    ? pluginState.participants.size()
    : 1;
}
