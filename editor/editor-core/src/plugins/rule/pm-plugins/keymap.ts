import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import * as commands from '../../../commands';
import { trackAndInvoke } from '../../../analytics';
import {
  withAnalytics,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
  EVENT_TYPE,
} from '../../analytics';

const insertRuleWithAnalytics = () =>
  withAnalytics({
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: ACTION_SUBJECT_ID.DIVIDER,
    attributes: { inputMethod: INPUT_METHOD.SHORTCUT },
    eventType: EVENT_TYPE.TRACK,
  })(commands.insertRule());

export function keymapPlugin(): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.insertRule.common!,
    trackAndInvoke(
      'atlassian.editor.format.horizontalrule.keyboard',
      insertRuleWithAnalytics(),
    ),
    list,
  );

  keymaps.bindKeymapWithCommand(keymaps.escape.common!, () => true, list);

  return keymap(list);
}

export default keymapPlugin;
