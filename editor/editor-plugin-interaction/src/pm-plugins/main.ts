import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { type InteractionState } from '../types';

export const key = new PluginKey<InteractionState>('interactionPluginHandler');

const handleInteraction = (view: EditorView) => {
	const interactionState = key.getState(view.state);
	if (!interactionState?.hasHadInteraction) {
		view.dispatch(view.state.tr.setMeta(key, { hasHadInteraction: true }));
	}
	return false;
};

export const createPlugin = () =>
	new SafePlugin<InteractionState>({
		key,
		state: {
			init() {
				return {
					hasHadInteraction: false,
				};
			},

			apply(tr, oldPluginState) {
				const meta = tr.getMeta(key) as InteractionState;
				if (typeof meta === 'object') {
					if (meta.hasHadInteraction !== oldPluginState.hasHadInteraction) {
						return {
							hasHadInteraction: meta.hasHadInteraction,
						};
					}
				}
				return oldPluginState;
			},
		},

		props: {
			handleDOMEvents: {
				// Handle all pointer click events (includes drag inside editor)
				mousedown: handleInteraction,
				// Handle keyboard events. Must be keyup to handle tabbing into editor (keyup occurs
				// on the "next focused" element)
				keyup: handleInteraction,
				// Handle drag and drop _into_ the editor from outside. Eg image DnD
				drop: handleInteraction,
				focus: fg('platform_editor_interaction_api_refactor') ? handleInteraction : undefined,
			},
		},
	});
