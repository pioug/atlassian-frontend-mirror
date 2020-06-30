import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';

import { trackAndInvoke } from '../../../analytics';
import * as commands from '../../../commands';
import * as keymaps from '../../../keymaps';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  withAnalytics,
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
