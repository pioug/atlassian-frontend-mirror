import { mentionPluginKey } from './key';
import { EditorState } from 'prosemirror-state';
import { MentionPluginState } from '../types';

export function getMentionPluginState(state: EditorState) {
  return mentionPluginKey.getState(state) as MentionPluginState;
}
