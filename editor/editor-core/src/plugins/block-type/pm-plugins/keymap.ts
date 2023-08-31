import { redo, undo } from '@atlaskit/editor-prosemirror/history';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { chainCommands } from '@atlaskit/editor-prosemirror/commands';

import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
  bindKeymapWithCommand,
  moveUp,
  moveDown,
  findKeyMapForBrowser,
  undo as undoKeymap,
  redo as redoKeymap,
  backspace,
  deleteKey,
  forwardDelete,
  toggleBlockQuote,
  keymap,
  insertNewLine,
  findShortcutByKeymap,
} from '@atlaskit/editor-common/keymaps';
import {
  insertNewLineWithAnalytics,
  createNewParagraphAbove,
  createNewParagraphBelow,
  deleteEmptyParagraphAndMoveBlockUp,
} from '@atlaskit/editor-common/utils';

import * as blockTypes from '../types';
import {
  cleanUpAtTheStartOfDocument,
  deleteAndMoveCursor,
  deleteBlockContent,
  insertBlockQuoteWithAnalytics,
} from '../commands';
import { isNodeAWrappingBlockNode } from '../utils';

const backspaceCommand = chainCommands(
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
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
  schema: Schema,
  _featureFlags: FeatureFlags,
): SafePlugin {
  const list = {};

  bindKeymapWithCommand(
    insertNewLine.common!,
    insertNewLineWithAnalytics(editorAnalyticsApi),
    list,
  );
  bindKeymapWithCommand(moveUp.common!, createNewParagraphAbove, list);
  bindKeymapWithCommand(moveDown.common!, createNewParagraphBelow, list);
  bindKeymapWithCommand(findKeyMapForBrowser(redoKeymap)!, redo, list);

  bindKeymapWithCommand(undoKeymap.common!, undo, list);

  bindKeymapWithCommand(backspace.common!, backspaceCommand, list);

  bindKeymapWithCommand(deleteKey.common!, del, list);

  bindKeymapWithCommand(forwardDelete.mac, del, list);

  if (schema.nodes[blockTypes.BLOCK_QUOTE.nodeName]) {
    bindKeymapWithCommand(
      findShortcutByKeymap(toggleBlockQuote)!,
      insertBlockQuoteWithAnalytics(INPUT_METHOD.KEYBOARD, editorAnalyticsApi),
      list,
    );
  }

  return keymap(list) as SafePlugin;
}
