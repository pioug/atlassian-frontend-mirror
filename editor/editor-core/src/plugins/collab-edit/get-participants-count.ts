import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { pluginKey } from './plugin-key';

export function getParticipantsCount(state?: EditorState): number {
  if (!state) {
    return 1;
  }

  const pluginState = pluginKey.getState(state);
  // @ts-ignore accessing private property
  return pluginState && pluginState.participants
    ? // @ts-ignore accessing private property
      pluginState.participants.size()
    : 1;
}
