import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { type FocusState } from '../types';

export const key = new PluginKey<FocusState>('focusPluginHandler');

export const createPlugin = () =>
	new SafePlugin<FocusState>({
		key,
		state: {
			// @ts-ignore - Workaround for help-center local consumption

			init() {
				return {
					hasFocus: false,
				};
			},

			// @ts-ignore - Workaround for help-center local consumption

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
			// @ts-ignore - Workaround for help-center local consumption

			handleDOMEvents: {
				// @ts-ignore - Workaround for help-center local consumption

				focus: (view) => {
					const focusState = key.getState(view.state);
					if (!focusState?.hasFocus) {
						view.dispatch(view.state.tr.setMeta(key, true));
					}
					return false;
				},
				// @ts-ignore - Workaround for help-center local consumption

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
