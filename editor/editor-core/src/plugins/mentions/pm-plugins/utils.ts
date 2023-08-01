import { mentionPluginKey } from './key';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { MentionPluginState } from '../types';
import { canInsert } from '@atlaskit/editor-prosemirror/utils';

export function getMentionPluginState(state: EditorState) {
  return mentionPluginKey.getState(state) as MentionPluginState;
}

export const canMentionBeCreatedInRange =
  (from: number, to: number) => (state: EditorState) => {
    const $from = state.doc.resolve(from);
    const $to = state.doc.resolve(to);
    const mention = state.schema.nodes.mention.createChecked();
    if ($from.parent === $to.parent && canInsert($from, mention)) {
      return true;
    }
    return false;
  };
