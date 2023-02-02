import { redo, undo } from 'prosemirror-history';
import { Schema } from 'prosemirror-model';
import { chainCommands } from 'prosemirror-commands';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import * as keymaps from '../../../keymaps';
import * as commands from '../../../commands';
import * as blockTypes from '../types';
import { keymap } from '../../../utils/keymap';
import { FeatureFlags } from '../../../types/feature-flags';
import {
  cleanUpAtTheStartOfDocument,
  deleteAndMoveCursor,
  deleteBlockContent,
  insertBlockTypesWithAnalytics,
} from '../commands';
import { deleteEmptyParagraphAndMoveBlockUp } from '../../../utils/commands';
import { INPUT_METHOD } from '../../analytics';
import { isNodeAWrappingBlockNode } from '../utils';

const backspace = chainCommands(
  cleanUpAtTheStartOfDocument,
  deleteBlockContent(isNodeAWrappingBlockNode),
  deleteAndMoveCursor,
);

const del = chainCommands(
  deleteEmptyParagraphAndMoveBlockUp(isNodeAWrappingBlockNode),
  deleteBlockContent(isNodeAWrappingBlockNode),
  deleteAndMoveCursor,
);

export default function keymapPlugin(
  schema: Schema,
  featureFlags: FeatureFlags,
): SafePlugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.insertNewLine.common!,
    commands.insertNewLineWithAnalytics,
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.moveUp.common!,
    commands.createNewParagraphAbove,
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.moveDown.common!,
    commands.createNewParagraphBelow,
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.findKeyMapForBrowser(keymaps.redo)!,
    redo,
    list,
  );

  keymaps.bindKeymapWithCommand(keymaps.undo.common!, undo, list);

  keymaps.bindKeymapWithCommand(keymaps.backspace.common!, backspace, list);

  keymaps.bindKeymapWithCommand(keymaps.deleteKey.common!, del, list);

  keymaps.bindKeymapWithCommand(keymaps.forwardDelete.mac, del, list);

  if (schema.nodes[blockTypes.BLOCK_QUOTE.nodeName]) {
    keymaps.bindKeymapWithCommand(
      keymaps.findShortcutByKeymap(keymaps.toggleBlockQuote)!,
      insertBlockTypesWithAnalytics(
        blockTypes.BLOCK_QUOTE.name,
        INPUT_METHOD.KEYBOARD,
      ),
      list,
    );
  }

  return keymap(list) as SafePlugin;
}
