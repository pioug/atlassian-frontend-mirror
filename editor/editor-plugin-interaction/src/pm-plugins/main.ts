import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorView } from '@atlaskit/editor-prosemirror/dist/types/view';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

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
				const meta = tr.getMeta(key) as boolean | { hasHadInteraction: boolean };
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
				mousedown: handleInteraction,
				keyup: handleInteraction,
				drop: handleInteraction,
			},
		},
	});
