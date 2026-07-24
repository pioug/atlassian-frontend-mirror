import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	backspace,
	bindKeymapWithCommand,
	deleteKey,
	enter,
	findKeyMapForBrowser,
	findShortcutByKeymap,
	forwardDelete,
	insertNewLine,
	keymap,
	moveDown,
	moveUp,
	redo as redoKeymap,
	toggleBlockQuote,
	undo as undoKeymap,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import {
	createNewParagraphAbove,
	createNewParagraphBelow,
	deleteEmptyParagraphAndMoveBlockUp,
	insertNewLineWithAnalytics,
} from '@atlaskit/editor-common/utils';
import { chainCommands } from '@atlaskit/editor-prosemirror/commands';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { redo, undo } from '@atlaskit/prosemirror-history';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as blockTypes from './block-types';
import { cleanUpAtTheStartOfDocument, insertBlockQuoteWithAnalytics } from './commands/block-type';
import { deleteAndMoveCursor } from './commands/delete-and-move-cursor';
import { deleteBlockContent } from './commands/delete-block-content';
import { splitHeadingWithTrailingSpace } from './commands/split-heading-with-trailing-space';
import { isNodeAWrappingBlockNode } from './utils';

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
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		insertNewLine.common!,
		insertNewLineWithAnalytics(editorAnalyticsApi),
		list,
	);

	// Fixes the "Enter after a heading with trailing whitespace creates another
	// heading instead of a paragraph" bug. The command is a no-op (returns false)
	// in every case except that exact scenario, so other Enter handlers are
	// unaffected.
	if (expValEquals('platform_editor_fix_new_line_after_heading', 'isEnabled', true)) {
		bindKeymapWithCommand(enter.common ?? 'Enter', splitHeadingWithTrailingSpace, list);
	}
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(moveUp.common!, createNewParagraphAbove, list);
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(moveDown.common!, createNewParagraphBelow, list);
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(findKeyMapForBrowser(redoKeymap)!, redo, list);

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(undoKeymap.common!, undo, list);

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(backspace.common!, backspaceCommand, list);

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(deleteKey.common!, del, list);

	bindKeymapWithCommand(forwardDelete.mac, del, list);

	if (schema.nodes[blockTypes.BLOCK_QUOTE.nodeName]) {
		bindKeymapWithCommand(
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			findShortcutByKeymap(toggleBlockQuote)!,
			insertBlockQuoteWithAnalytics(INPUT_METHOD.KEYBOARD, editorAnalyticsApi),
			list,
		);
	}

	return keymap(list) as SafePlugin;
}
