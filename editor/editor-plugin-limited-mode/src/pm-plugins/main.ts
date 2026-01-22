import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { LimitedModePluginState } from '../limitedModePluginType';

export const limitedModePluginKey = new PluginKey('limitedModePlugin');

const LIMITED_MODE_NODE_SIZE_THRESHOLD = 40000;

export const createPlugin = () => {
	return new SafePlugin<LimitedModePluginState>({
		key: limitedModePluginKey,
		view: (_view) => {
			return {};
		},
		state: {
			init(config, editorState) {
				// calculates the size of the doc, where when there are legacy content macros, the content
				// is stored in the attrs.
				// This is essentiall doc.nod
				let customDocSize = editorState.doc.nodeSize;
				editorState.doc.descendants((node) => {
					if (node.attrs?.extensionKey === 'legacy-content') {
						customDocSize += node.attrs?.parameters?.adf?.length ?? 0;
					}
				});

				return {
					documentSizeBreachesThreshold: customDocSize > LIMITED_MODE_NODE_SIZE_THRESHOLD,
				};
			},
			apply: (tr, currentPluginState) => {
				// Don't check the document size if we're already in limited mode.
				// We ALWAYS want to re-check the document size if we're replacing the document (e.g. live-to-live page navigation).
				if (currentPluginState.documentSizeBreachesThreshold && !tr.getMeta('replaceDocument')) {
					return currentPluginState;
				}

				// calculates the size of the doc, where when there are legacy content macros, the content
				// is stored in the attrs.
				// This is essentiall doc.nod
				let customDocSize = tr.doc.nodeSize;
				tr.doc.descendants((node) => {
					if (node.attrs?.extensionKey === 'legacy-content') {
						customDocSize += node.attrs?.parameters?.adf?.length ?? 0;
					}
				});

				return {
					documentSizeBreachesThreshold: customDocSize > LIMITED_MODE_NODE_SIZE_THRESHOLD,
				};
			},
		},
	});
};
