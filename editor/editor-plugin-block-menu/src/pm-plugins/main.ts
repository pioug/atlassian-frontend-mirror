import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import type { BlockMenuPlugin, FLAG_ID } from '../blockMenuPluginType';

import { shouldSuppressKeyboardEvent } from './utils/shouldSuppressKeyboardEvent';

export const blockMenuPluginKey = new PluginKey('blockMenuPlugin');

type BlockMenuPluginState = {
	showFlag: FLAG_ID | false;
};

export const createPlugin = (api: ExtractInjectionAPI<BlockMenuPlugin> | undefined) => {
	return new SafePlugin<BlockMenuPluginState>({
		key: blockMenuPluginKey,
		state: {
			init() {
				return {
					showFlag: false,
				};
			},

			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(blockMenuPluginKey);

				return {
					showFlag: meta?.showFlag ?? currentPluginState.showFlag,
				};
			},
		},
		props: {
			handleKeyDown: (_editorView: EditorView, event: KeyboardEvent) => {
				const blockMenuOpen =
					api?.userIntent?.sharedState.currentState()?.currentUserIntent === 'blockMenuOpen';

				// Exit early and do nothing when block menu is closed
				if (!blockMenuOpen) {
					return false;
				}

				// Block further handling of key events when block menu is open
				// Except for backspace/delete/copy/cut/paste/undo/redo/copy-link-to-selection which should be handled by the selection preservation plugin
				return shouldSuppressKeyboardEvent(event);
			},
		},
	});
};
