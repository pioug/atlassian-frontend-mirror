import { redo, undo } from '@atlaskit/editor-prosemirror/history';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { chainCommands } from '@atlaskit/editor-prosemirror/commands';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import * as keymaps from '../../../keymaps';
import * as commands from '../../../commands';
import * as blockTypes from '../types';
import { keymap } from '../../../utils/keymap';
import type { FeatureFlags } from '../../../types/feature-flags';
import {
  cleanUpAtTheStartOfDocument,
  deleteAndMoveCursor,
  deleteBlockContent,
  insertBlockTypesWithAnalytics,
} from '../commands';
import { deleteEmptyParagraphAndMoveBlockUp } from '@atlaskit/editor-common/utils';
import { INPUT_METHOD } from '../../analytics';
import { isNodeAWrappingBlockNode } from '../utils';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

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
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
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
        editorAnalyticsApi,
      ),
      list,
    );
  }

  return keymap(list) as SafePlugin;
}
