import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

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
			// @ts-ignore - Workaround for help-center local consumption

			init() {
				return {
					hasHadInteraction: false,
				};
			},

			// @ts-ignore - Workaround for help-center local consumption

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
			// @ts-ignore - Workaround for help-center local consumption

			handleDOMEvents: {
				// Handle all pointer click events (includes drag inside editor)
				// @ts-ignore - Workaround for help-center local consumption

				mousedown: handleInteraction,
				// Handle keyboard events. Must be keyup to handle tabbing into editor (keyup occurs
				// on the "next focused" element)
				keyup: handleInteraction,
				// Handle drag and drop _into_ the editor from outside. Eg image DnD
				drop: handleInteraction,
				// @ts-ignore - Workaround for help-center local consumption

				focus: handleInteraction,
			},
		},
	});
