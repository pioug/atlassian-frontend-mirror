import {
  bindKeymapWithCommand,
  moveLeft,
  moveRight,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import { arrowLeftFromTable, arrowRightFromTable } from '../commands/selection';
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

  return keymap(list) as SafePlugin;
}

export default tableSelectionKeymapPlugin;
