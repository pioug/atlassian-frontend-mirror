import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { ProviderFactory, Providers } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { setMacroProvider } from './actions';
import { pluginKey } from './plugin-key';
import type { MacroState } from './types';

export const createPlugin = (dispatch: Dispatch, providerFactory: ProviderFactory) =>
	new SafePlugin({
		state: {
			init: () => ({ macroProvider: null }),

			// @ts-ignore - Workaround for help-center local consumption

			apply(tr, state: MacroState) {
				const meta = tr.getMeta(pluginKey);
				if (meta) {
					const newState = { ...state, ...meta };
					dispatch(pluginKey, newState);

					return newState;
				}

				return state;
			},
		},
		key: pluginKey,
		view: (view: EditorView) => {
			const handleProvider = (_name: string, provider?: Providers['macroProvider']) =>
				provider && setMacroProvider(provider)(view);
			// make sure editable DOM node is mounted
			if (view.dom.parentNode) {
				providerFactory.subscribe('macroProvider', handleProvider);
			}
			return {
				destroy() {
					providerFactory.unsubscribe('macroProvider', handleProvider);
				},
			};
		},
	});
