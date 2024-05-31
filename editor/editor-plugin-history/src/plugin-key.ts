import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { HistoryPluginState } from './types';

/**
 * Plugin that keeps track of whether undo and redo are currently available
 * This is needed so we can enable/disable controls appropriately
 *
 * Actual undo/redo functionality is handled by prosemirror-history:
 * https://github.com/ProseMirror/prosemirror-history
 */

export const historyPluginKey = new PluginKey<HistoryPluginState>('historyPlugin');
