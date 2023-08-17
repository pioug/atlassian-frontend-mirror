import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  backspace,
  bindKeymapWithCommand,
  nextCell,
  previousCell,
  toggleTable,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import { chainCommands } from '@atlaskit/editor-prosemirror/commands';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import {
  createTable,
  goToNextCell,
  moveCursorBackward,
  triggerUnlessTableHeader,
} from '../commands';
import {
  addRowAroundSelection,
  deleteTableIfSelectedWithAnalytics,
  emptyMultipleCellsWithAnalytics,
} from '../commands-with-analytics';
import {
  addColumnAfter as addColumnAfterCommand,
  addColumnBefore as addColumnBeforeCommand,
} from '../commands/insert';
import { withEditorAnalyticsAPI } from '../utils/analytics';

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

  bindKeymapWithCommand(
    nextCell.common!,
    goToNextCell(editorAnalyticsAPI)(1),
    list,
  );
  bindKeymapWithCommand(
    previousCell.common!,
    goToNextCell(editorAnalyticsAPI)(-1),
    list,
  );
  bindKeymapWithCommand(
    toggleTable.common!,
    createTableWithAnalytics(editorAnalyticsAPI),
    list,
  );
  bindKeymapWithCommand(
    backspace.common!,
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
  bindKeymapWithCommand(backspace.common!, moveCursorBackward, list);

  // Add row/column shortcuts
  bindKeymapWithCommand(
    addRowBefore.common!,
    addRowAroundSelection(editorAnalyticsAPI)('TOP'),
    list,
  );

  bindKeymapWithCommand(
    addRowAfter.common!,
    addRowAroundSelection(editorAnalyticsAPI)('BOTTOM'),
    list,
  );

  bindKeymapWithCommand(
    addColumnBefore.common!,
    triggerUnlessTableHeader(addColumnBeforeCommand(getEditorContainerWidth)),
    list,
  );

  bindKeymapWithCommand(
    addColumnAfter.common!,
    addColumnAfterCommand(getEditorContainerWidth),
    list,
  );

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
