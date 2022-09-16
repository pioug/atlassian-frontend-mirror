import { keymap } from 'prosemirror-keymap';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { chainCommands } from 'prosemirror-commands';

import * as keymaps from '@atlaskit/editor-common/keymaps';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
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

import { withEditorAnalyticsAPI } from '../utils/analytics';
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

const createTableWithAnalytics = (
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
) =>
  withEditorAnalyticsAPI({
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: ACTION_SUBJECT_ID.TABLE,
    attributes: { inputMethod: INPUT_METHOD.SHORTCUT },
    eventType: EVENT_TYPE.TRACK,
  })(editorAnalyticsAPI)(createTable());

export function keymapPlugin(
  getEditorContainerWidth: GetEditorContainerWidth,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
): SafePlugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.nextCell.common!,
    goToNextCell(editorAnalyticsAPI)(1),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.previousCell.common!,
    goToNextCell(editorAnalyticsAPI)(-1),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.toggleTable.common!,
    createTableWithAnalytics(editorAnalyticsAPI),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    chainCommands(
      deleteTableIfSelectedWithAnalytics(editorAnalyticsAPI)(
        INPUT_METHOD.KEYBOARD,
      ),
      emptyMultipleCellsWithAnalytics(editorAnalyticsAPI)(
        INPUT_METHOD.KEYBOARD,
      ),
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
    addRowAroundSelection(editorAnalyticsAPI)('TOP'),
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.addRowAfter.common!,
    addRowAroundSelection(editorAnalyticsAPI)('BOTTOM'),
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.addColumnBefore.common!,
    triggerUnlessTableHeader(addColumnBefore(getEditorContainerWidth)),
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.addColumnAfter.common!,
    addColumnAfter(getEditorContainerWidth),
    list,
  );

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
