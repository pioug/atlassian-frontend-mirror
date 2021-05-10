import { chainCommands } from 'prosemirror-commands';
import { undoInputRule } from 'prosemirror-inputrules';
import { redo, undo } from 'prosemirror-history';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import * as commands from '../../../commands';
import * as blockTypes from '../types';
import { keymap } from '../../../utils/keymap';
import { FeatureFlags } from '../../../types/feature-flags';
import {
  cleanUpAtTheStartOfDocument,
  insertBlockTypesWithAnalytics,
} from '../../block-type/commands';
import { INPUT_METHOD } from '../../analytics';

const tryUndoInputRuleElseUndoHistory = chainCommands(undoInputRule, undo);

export default function keymapPlugin(
  schema: Schema,
  featureFlags: FeatureFlags,
): Plugin {
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

  keymaps.bindKeymapWithCommand(
    keymaps.undo.common!,
    featureFlags.useUnpredictableInputRule
      ? tryUndoInputRuleElseUndoHistory
      : undo,
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    cleanUpAtTheStartOfDocument,
    list,
  );

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

  return keymap(list);
}
