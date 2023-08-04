import { redo, undo } from '@atlaskit/editor-prosemirror/history';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { chainCommands } from '@atlaskit/editor-prosemirror/commands';

import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import * as keymaps from '@atlaskit/editor-common/keymaps';
import { keymap } from '@atlaskit/editor-common/keymaps';
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
  insertBlockTypesWithAnalytics,
} from '../commands';
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
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
  schema: Schema,
  _featureFlags: FeatureFlags,
): SafePlugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.insertNewLine.common!,
    insertNewLineWithAnalytics(editorAnalyticsApi),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.moveUp.common!,
    createNewParagraphAbove,
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.moveDown.common!,
    createNewParagraphBelow,
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
