import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import type { LimitedModePluginState } from '../limitedModePluginType';

export const limitedModePluginKey = new PluginKey('limitedModePlugin');

export const createPlugin = () => {
	return new SafePlugin<LimitedModePluginState>({
		key: limitedModePluginKey,
		// @ts-ignore - Workaround for help-center local consumption

		view: (_view) => {
			return {};
		},
		state: {
			// @ts-ignore - Workaround for help-center local consumption

			init(config, editorState) {
				// @ts-expect-error - true is not allowed as a default value
				if (expVal('cc_editor_limited_mode_include_lcm', 'isEnabled', true)) {
					// calculates the size of the doc, where when there are legacy content macros, the content
					// is stored in the attrs.
					// This is essentiall doc.nod
					let customDocSize = editorState.doc.nodeSize;
					// @ts-ignore - Workaround for help-center local consumption

					editorState.doc.descendants((node) => {
						if (node.attrs?.extensionKey === 'legacy-content') {
							customDocSize += node.attrs?.parameters?.adf?.length ?? 0;
						}
					});

					return {
						documentSizeBreachesThreshold:
							customDocSize > expVal('cc_editor_limited_mode', 'nodeSize', 100),
					};
				} else {
					if (editorState.doc.nodeSize > expVal('cc_editor_limited_mode', 'nodeSize', 100)) {
						return { documentSizeBreachesThreshold: true };
					}
					return { documentSizeBreachesThreshold: false };
				}
			},
			// @ts-ignore - Workaround for help-center local consumption

			apply: (tr, currentPluginState) => {
				// Don't check the document size if we're already in limited mode.
				// We ALWAYS want to re-check the document size if we're replacing the document (e.g. live-to-live page navigation).
				if (currentPluginState.documentSizeBreachesThreshold && !tr.getMeta('replaceDocument')) {
					return currentPluginState;
				}

				// @ts-expect-error - true is not allowed as a default value
				if (expVal('cc_editor_limited_mode_include_lcm', 'isEnabled', true)) {
					// calculates the size of the doc, where when there are legacy content macros, the content
					// is stored in the attrs.
					// This is essentiall doc.nod
					let customDocSize = tr.doc.nodeSize;
					// @ts-ignore - Workaround for help-center local consumption

					tr.doc.descendants((node) => {
						if (node.attrs?.extensionKey === 'legacy-content') {
							customDocSize += node.attrs?.parameters?.adf?.length ?? 0;
						}
					});

					return {
						documentSizeBreachesThreshold:
							customDocSize > expVal('cc_editor_limited_mode', 'nodeSize', 100),
					};
				} else {
					if (tr.doc.nodeSize > expVal('cc_editor_limited_mode', 'nodeSize', 100)) {
						return { ...currentPluginState, documentSizeBreachesThreshold: true };
					}

					return { ...currentPluginState, documentSizeBreachesThreshold: false };
				}
			},
		},
	});
};
