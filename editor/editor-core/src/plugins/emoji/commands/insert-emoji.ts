import type { EmojiId } from '@atlaskit/emoji';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import type { Command } from '../../../types';
import type { INPUT_METHOD } from '../../analytics';
import {
  addAnalytics,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
  ACTION_SUBJECT,
  ACTION,
} from '../../analytics';

export function insertEmoji(
  emojiId: EmojiId,
  inputMethod?:
    | INPUT_METHOD.PICKER
    | INPUT_METHOD.ASCII
    | INPUT_METHOD.TYPEAHEAD,
): Command {
  return (state, dispatch) => {
    const { emoji } = state.schema.nodes;

    if (emoji && emojiId) {
      const node = emoji.createChecked({
        ...emojiId,
        text: emojiId.fallback || emojiId.shortName,
      });
      const textNode = state.schema.text(' ');

      if (dispatch) {
        const fragment = Fragment.fromArray([node, textNode]);
        const tr = safeInsert(fragment)(state.tr);
        if (inputMethod) {
          addAnalytics(state, tr, {
            action: ACTION.INSERTED,
            actionSubject: ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: ACTION_SUBJECT_ID.EMOJI,
            attributes: { inputMethod },
            eventType: EVENT_TYPE.TRACK,
          });
        }

        dispatch(
          tr.setSelection(
            Selection.near(
              tr.doc.resolve(state.selection.$from.pos + fragment.size),
            ),
          ),
        );
      }
      return true;
    }
    return false;
  };
}
