import {
  bindKeymapWithCommand,
  moveLeft,
  moveRight,
  selectColumn,
  selectRow,
  shiftArrowUp,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import {
  arrowLeftFromTable,
  arrowRightFromTable,
  selectColumns,
  selectRows,
  shiftArrowUpFromTable,
} from '../commands/selection';
import type tablePlugin from '../index';

export function tableSelectionKeymapPlugin(
  editorSelectionAPI:
    | ExtractInjectionAPI<typeof tablePlugin>['selection']
    | undefined,
): SafePlugin {
  const list = {};

  bindKeymapWithCommand(
    moveRight.common!,
    arrowRightFromTable(editorSelectionAPI)(),
    list,
  );

  bindKeymapWithCommand(
    moveLeft.common!,
    arrowLeftFromTable(editorSelectionAPI)(),
    list,
  );

  if (getBooleanFF('platform.editor.table.shift-arrowup-fix')) {
    bindKeymapWithCommand(
      shiftArrowUp.common!,
      shiftArrowUpFromTable(editorSelectionAPI)(),
      list,
    );
  }

  bindKeymapWithCommand(
    selectColumn.common!,
    selectColumns(editorSelectionAPI)(),
    list,
  );

  bindKeymapWithCommand(
    selectRow.common!,
    selectRows(editorSelectionAPI)(),
    list,
  );

  return keymap(list) as SafePlugin;
}

export default tableSelectionKeymapPlugin;
