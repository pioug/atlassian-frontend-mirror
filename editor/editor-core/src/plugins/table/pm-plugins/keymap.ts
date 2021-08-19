import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import { chainCommands } from 'prosemirror-commands';

import * as keymaps from '../../../keymaps';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  withAnalytics,
} from '../../analytics';
import {
  createTable,
  goToNextCell,
  moveCursorBackward,
  triggerUnlessTableHeader,
} from '../commands';
import {
  addRowAroundSelection,
  emptyMultipleCellsWithAnalytics,
  deleteTableIfSelectedWithAnalytics,
} from '../commands-with-analytics';
import { addColumnAfter, addColumnBefore } from '../commands/insert';

const createTableWithAnalytics = () =>
  withAnalytics({
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: ACTION_SUBJECT_ID.TABLE,
    attributes: { inputMethod: INPUT_METHOD.SHORTCUT },
    eventType: EVENT_TYPE.TRACK,
  })(createTable());

export function keymapPlugin(): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.nextCell.common!,
    goToNextCell(1),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.previousCell.common!,
    goToNextCell(-1),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.toggleTable.common!,
    createTableWithAnalytics(),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    chainCommands(
      deleteTableIfSelectedWithAnalytics(INPUT_METHOD.KEYBOARD),
      emptyMultipleCellsWithAnalytics(INPUT_METHOD.KEYBOARD),
    ),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    moveCursorBackward,
    list,
  );

  // Add row/column shortcuts
  keymaps.bindKeymapWithCommand(
    keymaps.addRowBefore.common!,
    addRowAroundSelection('TOP'),
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.addRowAfter.common!,
    addRowAroundSelection('BOTTOM'),
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.addColumnBefore.common!,
    triggerUnlessTableHeader(addColumnBefore),
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.addColumnAfter.common!,
    addColumnAfter,
    list,
  );

  return keymap(list);
}

export default keymapPlugin;
