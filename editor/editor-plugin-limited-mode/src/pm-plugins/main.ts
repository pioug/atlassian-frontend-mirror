import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import type { LimitedModePluginState } from '../limitedModePluginType';

export const limitedModePluginKey = new PluginKey('limitedModePlugin');

export const createPlugin = () => {
	return new SafePlugin<LimitedModePluginState>({
		key: limitedModePluginKey,
		view: (_view) => {
			return {};
		},
		state: {
			init(config, editorState) {
				if (editorState.doc.nodeSize > expVal('cc_editor_limited_mode', 'nodeSize', 100)) {
					return { documentSizeBreachesThreshold: true };
				}
				return { documentSizeBreachesThreshold: false };
			},
			apply: (tr, currentPluginState) => {
				// Don't check the document size if we're already in limited mode.
				if (currentPluginState.documentSizeBreachesThreshold) {
					return currentPluginState;
				}

				if (tr.doc.nodeSize > expVal('cc_editor_limited_mode', 'nodeSize', 100)) {
					return { ...currentPluginState, documentSizeBreachesThreshold: true };
				}
				return currentPluginState;
			},
		},
	});
};
