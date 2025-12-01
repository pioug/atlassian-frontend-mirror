import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { type FocusState } from '../types';

export const key = new PluginKey<FocusState>('focusPluginHandler');

export const createPlugin = () =>
	new SafePlugin<FocusState>({
		key,
		state: {
			init() {
				return {
					hasFocus: false,
				};
			},

			apply(tr, oldPluginState) {
				const meta = tr.getMeta(key) as boolean;
				if (typeof meta === 'boolean') {
					if (meta !== oldPluginState.hasFocus) {
						return {
							hasFocus: meta,
						};
					}
				}
				return oldPluginState;
			},
		},

		props: {
			handleDOMEvents: {
				focus: (view) => {
					const focusState = key.getState(view.state);
					if (!focusState?.hasFocus) {
						view.dispatch(view.state.tr.setMeta(key, true));
					}
					return false;
				},
				blur: (view) => {
					const focusState = key.getState(view.state);
					if (focusState?.hasFocus) {
						view.dispatch(view.state.tr.setMeta(key, false));
					}
					return false;
				},
			},
		},
	});
